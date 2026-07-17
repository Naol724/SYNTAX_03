import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "./mongoose"
import { AdminUser } from "./models"

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
          throw new Error("Invalid credentials")
        }

        await connectToDatabase()

        const admin = await AdminUser.findOne({ email: credentials.email })

        if (!admin) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await admin.comparePassword(credentials.password)

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
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
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV === "production"
      ? undefined
      : "dev-only-secret-not-for-production"),
}
