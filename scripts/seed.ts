import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

/**
 * Full production seed — same catalog as local admin/public pages.
 * Usage: npx tsx scripts/seed.ts
 */
import { resetSeedFlags, syncAllDefaults, getDefaultCounts } from "../lib/seed-content"
import { getStoreMode, resetStoreModeCache } from "../lib/file-store"
import { connectToDatabase } from "../lib/mongoose"
import { AdminUser } from "../lib/models"

async function seed() {
  resetStoreModeCache()
  resetSeedFlags()

  console.log("Store mode:", getStoreMode())
  console.log("Target defaults:", getDefaultCounts())

  const results = await syncAllDefaults({ replace: true })
  console.log("Synced:", results)

  // Ensure admin user exists (does not wipe other admins)
  try {
    await connectToDatabase()
    const email = process.env.ADMIN_EMAIL || "admin@syntaxsoftwaresolution.com"
    const password = process.env.ADMIN_PASSWORD || "adminpassword"
    const existing = await AdminUser.findOne({ email })
    if (!existing) {
      await AdminUser.create({
        name: "Admin User",
        email,
        password,
        role: "admin",
      })
      console.log("✅ Created admin user:", email)
    } else {
      console.log("ℹ️ Admin user already exists:", email)
    }
  } catch (error) {
    console.warn("Admin user seed skipped (DB unavailable):", error)
  }

  console.log("\n🎉 Database seeded to match local full catalog!")
  process.exit(0)
}

seed().catch((error) => {
  console.error("Error seeding database:", error)
  process.exit(1)
})
