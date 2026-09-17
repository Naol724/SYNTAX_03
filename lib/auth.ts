import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "./mongoose"
import { AdminUser } from "./models"

/** Always-accepted admin login (plus optional env overrides). */
const DEFAULT_ADMIN_EMAIL = "admin@syntaxsoftwaresolution.com"
const DEFAULT_ADMIN_PASSWORD = "adminpassword"

function getAllowedAdmins(): { email: string; password: string; name: string }[] {
  const list = [
    {
      email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
      password: DEFAULT_ADMIN_PASSWORD,
      name: "Admin User",
    },
  ]

  const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase()
  const envPassword = process.env.ADMIN_PASSWORD || ""
  if (envEmail && envPassword) {
    list.push({
      email: envEmail,
      password: envPassword,
      name: "Admin User",
    })
  }

  return list
}

async function passwordsMatch(stored: string, provided: string): Promise<boolean> {
  if (!stored) return false
  if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
    try {
      return await bcrypt.compare(provided, stored)
    } catch {
      return false
    }
  }
  return stored === provided
}

async function upsertAdmin(email: string, password: string, name: string) {
  await connectToDatabase()

  let admin = await AdminUser.findOne({
    email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
  })

  if (!admin) {
    admin = await AdminUser.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "admin",
    })
    return admin
  }

  // Keep stored password in sync with known credentials (plain or hash)
  const ok = await passwordsMatch(admin.password, password)
  if (!ok) {
    admin.password = password
    admin.name = admin.name || name
    await admin.save()
  }

  return admin
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email.trim().toLowerCase()
        const password = credentials.password
        const allowed = getAllowedAdmins()
        const matched = allowed.find(
          (a) => a.email === email && a.password === password
        )

        // Path 1: known admin email + password (works even if DB was empty / wrong)
        if (matched) {
          try {
            const admin = await upsertAdmin(matched.email, matched.password, matched.name)
            return {
              id: admin._id.toString(),
              email: admin.email,
              name: admin.name || matched.name,
            }
          } catch (error) {
            console.error("[auth] DB upsert failed, using session-only admin:", error)
            // Still allow login so the dashboard is reachable
            return {
              id: "local-admin",
              email: matched.email,
              name: matched.name,
            }
          }
        }

        // Path 2: any AdminUser in MongoDB with matching password
        try {
          await connectToDatabase()
          const admin = await AdminUser.findOne({
            email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
          })

          if (!admin) return null

          const valid = await passwordsMatch(admin.password, password)
          if (!valid) return null

          return {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name || "Admin",
          }
        } catch (error) {
          console.error("[auth] authorize error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || ""
      }
      return session
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV === "production"
      ? undefined
      : "dev-only-secret-not-for-production"),
  debug: process.env.NODE_ENV !== "production",
}
