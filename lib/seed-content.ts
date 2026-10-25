/**
 * Default site content for admin lists (services, projects, blog, testimonials, team).
 * Auto-seeded into file/Mongo store when a collection is empty.
 */

import { fileStore, getStoreMode } from "@/lib/file-store"

type Resource = "services" | "portfolio" | "blog" | "testimonials" | "team"

export const DEFAULT_SERVICES = [
  {
    name: "Website Development",
    shortDescription: "Modern, responsive websites built with modern frameworks",
    description:
      "High-performance websites and web applications that drive results. From business sites to complex web apps, we deliver solutions that look great and perform even better.",
    category: "Website",
    languages: ["Next.js", "React", "SEO", "CMS"],
    icon: "globe",
    price: "",
    active: true,
    featured: true,
    order: 1,
  },
  {
    name: "Mobile Applications",
    shortDescription: "Native and cross-platform mobile apps",
    description:
      "Deliver seamless user experiences on iOS and Android with React Native. We build apps that engage users and drive business growth.",
    category: "Mobile",
    languages: ["React Native", "iOS", "Android"],
    icon: "smartphone",
    price: "",
    active: true,
    featured: true,
    order: 2,
  },
  {
    name: "Gaming Platforms",
    shortDescription: "Real-time multiplayer gaming experiences",
    description:
      "Custom bingo callers, lottery systems, and interactive gaming platforms with real-time capabilities and admin dashboards.",
    category: "Gaming",
    languages: ["React", "WebSocket", "Node.js"],
    icon: "gamepad",
    price: "",
    active: true,
    featured: true,
    order: 3,
  },
  {
    name: "Enterprise Systems",
    shortDescription: "End-to-end business management solutions",
    description:
      "Streamline your operations with custom software including POS, inventory management, HR systems, and comprehensive ERP solutions.",
    category: "Enterprise",
    languages: ["Node.js", "PostgreSQL", "ERP"],
    icon: "building",
    price: "",
    active: true,
    featured: false,
    order: 4,
  },
  {
    name: "Bot Development",
    shortDescription: "Intelligent automation with Telegram bots and AI",
    description:
      "Automate customer service, orders, and internal workflows with intelligent Telegram bots and AI-powered chatbots.",
    category: "AI / Bots",
    languages: ["Telegram Bot", "AI", "Node.js"],
    icon: "bot",
    price: "",
    active: true,
    featured: true,
    order: 5,
  },
  {
    name: "UI/UX Design",
    shortDescription: "User-centered design that combines aesthetics with usability",
    description:
      "Create interfaces people love to use. From research and wireframes to high-fidelity prototypes and design systems.",
    category: "Design",
    languages: ["Figma", "Prototyping", "Design Systems"],
    icon: "palette",
    price: "",
    active: true,
    featured: false,
    order: 6,
  },
  {
    name: "Cloud & DevOps",
    shortDescription: "Scalable infrastructure and deployment automation",
    description:
      "Build reliable, scalable applications with modern cloud infrastructure, CI/CD pipelines, and deployment automation.",
    category: "Cloud",
    languages: ["AWS", "Docker", "CI/CD"],
    icon: "cloud",
    price: "",
    active: true,
    featured: false,
    order: 7,
  },
  {
    name: "Support & Maintenance",
    shortDescription: "Ongoing support for your digital products",
    description:
      "Keep your software running smoothly with 24/7 support, security updates, performance monitoring, and continuous improvements.",
    category: "Support",
    languages: ["Monitoring", "Security", "Support"],
    icon: "headset",
    price: "",
    active: true,
    featured: false,
    order: 8,
  },
]

export const DEFAULT_PORTFOLIO = [
  {
    title: "Saron Orthopedic Center",
    slug: "saron-orthopedic",
    description:
      "Professional medical website with appointment booking, service listings, and patient information.",
    category: "Healthcare",
    images: [],
    thumbnail: "",
    client: "Saron Orthopedic Center",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    projectUrl: "https://saronorthopediccenter.com",
    githubUrl: "",
    featured: true,
    active: true,
    order: 1,
  },
  {
    title: "Godu General Trading",
    slug: "godu-trading",
    description:
      "Corporate trading platform with AI chatbot for customer queries and automated support.",
    category: "Chatbot / Trading",
    images: [],
    thumbnail: "",
    client: "Godu GT",
    technologies: ["React", "Node.js", "Telegram Bot"],
    projectUrl: "https://godugt.com",
    githubUrl: "",
    featured: true,
    active: true,
    order: 2,
  },
  {
    title: "VanguardX Import & Export",
    slug: "vanguardx",
    description: "Premium corporate website for an international import & export company.",
    category: "Corporate",
    images: [],
    thumbnail: "",
    client: "VanguardX",
    technologies: ["Next.js", "TypeScript", "AWS"],
    projectUrl: "https://vanguardxie.com",
    githubUrl: "",
    featured: true,
    active: true,
    order: 3,
  },
  {
    title: "Zeban Security Services",
    slug: "zeban-security",
    description:
      "Professional security company website with services, contact, and team profiles.",
    category: "Corporate",
    images: [],
    thumbnail: "",
    client: "Zeban Security",
    technologies: ["React", "Tailwind CSS", "Node.js"],
    projectUrl: "https://zebansecurityservices.com",
    githubUrl: "",
    featured: false,
    active: true,
    order: 4,
  },
  {
    title: "Dubai Furniture ET",
    slug: "dubai-furniture",
    description:
      "Full e-commerce marketplace for premium furniture with catalog, cart, and payment.",
    category: "E-Commerce",
    images: [],
    thumbnail: "",
    client: "Dubai Furniture ET",
    technologies: ["Next.js", "MongoDB", "Stripe"],
    projectUrl: "https://dubaifurnitureet.com",
    githubUrl: "",
    featured: true,
    active: true,
    order: 5,
  },
  {
    title: "Pin Trading",
    slug: "pin-trading",
    description: "Trading platform with Telegram bot for order automation and notifications.",
    category: "Chatbot / Trading",
    images: [],
    thumbnail: "",
    client: "Pin Trading",
    technologies: ["React", "Node.js", "Telegram Bot"],
    projectUrl: "https://pintrading.et",
    githubUrl: "",
    featured: false,
    active: true,
    order: 6,
  },
  {
    title: "Mela Exam Platform",
    slug: "mela-exam",
    description:
      "Online exam platform with quiz engine, results, leaderboards, and admin dashboard.",
    category: "EdTech",
    images: [],
    thumbnail: "",
    client: "Mela Exam",
    technologies: ["React", "Node.js", "PostgreSQL"],
    projectUrl: "https://melaexam.com",
    githubUrl: "",
    featured: true,
    active: true,
    order: 7,
  },
  {
    title: "King Bingo",
    slug: "king-bingo",
    description:
      "Real-time multiplayer online bingo platform with live rooms, payments & admin panel.",
    category: "Gaming",
    images: [],
    thumbnail: "",
    client: "King Bingo",
    technologies: ["React", "WebSocket", "Node.js", "PostgreSQL"],
    projectUrl: "",
    githubUrl: "",
    featured: true,
    active: true,
    order: 8,
  },
  {
    title: "Award Bingo",
    slug: "award-bingo",
    description:
      "Online bingo gaming platform with reward system, multiplayer, and payment gateway.",
    category: "Gaming",
    images: [],
    thumbnail: "",
    client: "Award Bingo",
    technologies: ["React", "WebSocket", "MongoDB"],
    projectUrl: "",
    githubUrl: "",
    featured: false,
    active: true,
    order: 9,
  },
  {
    title: "Waza Bingo",
    slug: "waza-bingo",
    description:
      "Feature-rich bingo platform with social gameplay, leaderboards, and multi-currency.",
    category: "Gaming",
    images: [],
    thumbnail: "",
    client: "Waza Bingo",
    technologies: ["React", "Node.js", "Firebase"],
    projectUrl: "",
    githubUrl: "",
    featured: false,
    active: true,
    order: 10,
  },
  {
    title: "DUX Architects",
    slug: "dux-architects",
    description:
      "Portfolio site showcasing architectural projects, design philosophy, and professional services.",
    category: "Corporate",
    images: [],
    thumbnail: "",
    client: "DUX Architects",
    technologies: ["Next.js", "TypeScript", "Tailwind"],
    projectUrl: "https://duxarchitects.com",
    githubUrl: "",
    featured: false,
    active: true,
    order: 11,
  },
  {
    title: "Kidest Shiro Cafe",
    slug: "kidest-cafe",
    description:
      "Restaurant ordering platform with online menu, digital ordering, and delivery management.",
    category: "E-Commerce",
    images: [],
    thumbnail: "",
    client: "Kidest Shiro Cafe",
    technologies: ["React", "Node.js", "MongoDB"],
    projectUrl: "https://kidestshiro.com",
    githubUrl: "",
    featured: false,
    active: true,
    order: 12,
  },
]

export const DEFAULT_BLOG = [
  {
    title: "Getting Started with Next.js 15",
    slug: "getting-started-with-nextjs-15",
    excerpt:
      "Learn the new features and improvements in Next.js 15 including the App Router and Server Components.",
    content:
      "<p>Next.js 15 brings exciting new features for building fast, modern web apps. At SYNTAX we use it for client projects across Ethiopia.</p>",
    featuredImage: "",
    category: "Development",
    tags: ["Next.js", "React", "Web Development"],
    author: "Syntax Team",
    published: true,
    featured: true,
    views: 0,
  },
  {
    title: "Building Scalable APIs with Node.js",
    slug: "building-scalable-apis-with-nodejs",
    excerpt:
      "Best practices for building production-ready APIs that can handle real-world traffic.",
    content:
      "<p>Building scalable APIs requires careful planning around authentication, caching, and database design.</p>",
    featuredImage: "",
    category: "Development",
    tags: ["Node.js", "API", "Backend"],
    author: "Syntax Team",
    published: true,
    featured: false,
    views: 0,
  },
  {
    title: "The Future of AI in Software Development",
    slug: "future-of-ai-in-software-development",
    excerpt:
      "How AI is transforming the way we write code and build software applications.",
    content:
      "<p>AI is revolutionizing software development — from chatbots to code assistants and automated testing.</p>",
    featuredImage: "",
    category: "Technology",
    tags: ["AI", "Machine Learning", "Future"],
    author: "Syntax Team",
    published: true,
    featured: true,
    views: 0,
  },
]

export const DEFAULT_TESTIMONIALS = [
  {
    name: "Abebe Kebede",
    company: "Ethio Tech Solutions",
    content:
      "SYNTAX transformed our digital presence with their innovative approach. Their expertise in web development helped us achieve 300% growth in online engagement.",
    rating: 5,
    image: "",
    active: true,
    featured: true,
    order: 1,
  },
  {
    name: "Kebede Alemu",
    company: "Digital Ethiopia",
    content:
      "Working with SYNTAX has been a game-changer. Their mobile app team delivered a solution that exceeded expectations and increased our user base by 250%.",
    rating: 5,
    image: "",
    active: true,
    featured: true,
    order: 2,
  },
  {
    name: "Solomon Teklu",
    company: "Ethiopian Finance Corp",
    content:
      "The enterprise solutions provided by SYNTAX significantly improved our operations. Their professionalism and technical skills are unmatched in the Ethiopian market.",
    rating: 5,
    image: "",
    active: true,
    featured: true,
    order: 3,
  },
]

export const DEFAULT_TEAM = [
  {
    name: "Nathenal Teklay",
    role: "Co-Founder & CEO",
    bio: "Leads business strategy, vision, and client relationships. Passionate about building Ethiopia's tech ecosystem.",
    image: "",
    email: "nathenal@syntax.et",
    skills: ["Strategy", "Leadership", "Sales"],
    yearsExperience: 8,
    linkedin: "https://linkedin.com/in/nathenaltek",
    github: "",
    twitter: "",
    active: true,
    order: 1,
  },
  {
    name: "Leulseged Lemma",
    role: "Co-Founder & CTO",
    bio: "Oversees technical architecture and engineering standards. Full-stack expert with 10+ years experience.",
    image: "",
    email: "leulseged@syntax.et",
    skills: ["Architecture", "Full-stack", "Cloud"],
    yearsExperience: 10,
    linkedin: "https://linkedin.com/in/leulsegedlemma",
    github: "https://github.com/leulseged",
    twitter: "",
    active: true,
    order: 2,
  },
  {
    name: "Tsega",
    role: "Senior Developer",
    bio: "Full-stack expert in scalable web & enterprise platforms. Specializes in React, Node.js, and cloud architecture.",
    image: "",
    email: "",
    skills: ["React", "Node.js", "Cloud"],
    yearsExperience: 5,
    linkedin: "https://linkedin.com/in/tsega",
    github: "",
    twitter: "",
    active: true,
    order: 3,
  },
  {
    name: "Nati",
    role: "Senior Developer",
    bio: "Backend architect focused on API design & high-performance systems. PostgreSQL and microservices specialist.",
    image: "",
    email: "",
    skills: ["API", "PostgreSQL", "Microservices"],
    yearsExperience: 5,
    linkedin: "",
    github: "https://github.com/nati",
    twitter: "",
    active: true,
    order: 4,
  },
  {
    name: "Kiya",
    role: "Cybersecurity Specialist",
    bio: "Penetration testing, data protection & security audits. Certified security professional protecting client assets.",
    image: "",
    email: "",
    skills: ["Security", "Pentesting", "Audits"],
    yearsExperience: 4,
    linkedin: "https://linkedin.com/in/kiya",
    github: "",
    twitter: "",
    active: true,
    order: 5,
  },
]

const DEFAULTS: Record<Resource, any[]> = {
  services: DEFAULT_SERVICES,
  portfolio: DEFAULT_PORTFOLIO,
  blog: DEFAULT_BLOG,
  testimonials: DEFAULT_TESTIMONIALS,
  team: DEFAULT_TEAM,
}

const seeded = new Set<Resource>()

/** Bump this when default content grows — deploy will full-sync once. */
export const CONTENT_SEED_VERSION = 3

function itemKey(resource: Resource, row: any): string {
  if (resource === "portfolio" || resource === "blog") {
    return String(row.slug || row.title || "").toLowerCase()
  }
  return String(row.name || "").toLowerCase()
}

function seedIntoFile(resource: Resource, replace = false) {
  const defaults = DEFAULTS[resource]
  if (replace) {
    fileStore.clear(resource)
    for (const row of defaults) fileStore.create(resource, row)
    console.log(`[seed] Replaced file ${resource} with ${defaults.length} items`)
    return defaults.length
  }

  const existing = fileStore.list(resource)
  const have = new Set(existing.map((r: any) => itemKey(resource, r)))
  let added = 0
  for (const row of defaults) {
    const key = itemKey(resource, row)
    if (!key || have.has(key)) continue
    fileStore.create(resource, row)
    have.add(key)
    added++
  }
  if (added > 0) {
    console.log(`[seed] Added ${added} missing ${resource} into .data/ (now ${fileStore.count(resource)})`)
  } else if (existing.length === 0) {
    for (const row of defaults) fileStore.create(resource, row)
    console.log(`[seed] Seeded ${defaults.length} ${resource} into .data/`)
    return defaults.length
  }
  return added
}

async function getModelMap() {
  const { connectToDatabase } = await import("@/lib/mongoose")
  const {
    Service,
    Portfolio,
    BlogPost,
    Testimonial,
    TeamMember,
  } = await import("@/lib/models")
  await connectToDatabase()
  return {
    services: Service,
    portfolio: Portfolio,
    blog: BlogPost,
    testimonials: Testimonial,
    team: TeamMember,
  } as const
}

/**
 * Sync one resource with full site defaults.
 * - replace=true → wipe collection and insert full local defaults (deploy = local)
 * - replace=false → insert any missing defaults (keeps extra admin-created rows)
 */
export async function syncResourceDefaults(
  resource: Resource,
  opts?: { replace?: boolean }
) {
  const replace = !!opts?.replace
  const defaults = DEFAULTS[resource]

  if (getStoreMode() === "file") {
    seedIntoFile(resource, replace)
    seeded.add(resource)
    return { resource, mode: "file" as const, count: fileStore.count(resource) }
  }

  try {
    const ModelMap = await getModelMap()
    const Model = ModelMap[resource]

    if (replace) {
      await Model.deleteMany({})
      await Model.insertMany(defaults)
      console.log(`[seed] Replaced Mongo ${resource} with ${defaults.length} items`)
      seeded.add(resource)
      return { resource, mode: "mongo" as const, count: defaults.length }
    }

    const existing = await Model.find().lean()

    // Incomplete catalog (classic deploy bug: 2 projects / 3 services) → full replace
    if (existing.length < defaults.length) {
      await Model.deleteMany({})
      await Model.insertMany(defaults)
      console.log(
        `[seed] Upgraded Mongo ${resource}: ${existing.length} → ${defaults.length}`
      )
      seeded.add(resource)
      return { resource, mode: "mongo" as const, count: defaults.length }
    }

    seeded.add(resource)
    return { resource, mode: "mongo" as const, count: existing.length }
  } catch (error) {
    console.error(
      `[seed] Mongo unavailable for ${resource}, using file fallback:`,
      error
    )
    seedIntoFile(resource, replace)
    seeded.add(resource)
    return { resource, mode: "file" as const, count: fileStore.count(resource) }
  }
}

/**
 * Ensure defaults exist. Safe on every request.
 * Completes partial deploys (e.g. only 2 projects / 3 services from old seed).
 * Does NOT skip when the in-memory flag is set but the DB is still incomplete.
 */
export async function ensureResourceSeeded(resource: Resource) {
  if (seeded.has(resource)) return
  const result = await syncResourceDefaults(resource, { replace: false })
  // Only mark done when the collection is actually full
  if (result.count >= DEFAULTS[resource].length) {
    seeded.add(resource)
  } else {
    seeded.delete(resource)
  }
}

export async function ensureAllSeeded() {
  for (const key of Object.keys(DEFAULTS) as Resource[]) {
    await ensureResourceSeeded(key)
  }
}

/** Full sync — makes deployed content match local default lists. */
export async function syncAllDefaults(opts?: { replace?: boolean }) {
  resetSeedFlags()
  const results = []
  for (const key of Object.keys(DEFAULTS) as Resource[]) {
    results.push(await syncResourceDefaults(key, opts))
  }
  return results
}

/** Force re-check (e.g. after deploy) — clears in-memory "already seeded" flags. */
export function resetSeedFlags() {
  seeded.clear()
}

export function getDefaultCounts() {
  return {
    services: DEFAULT_SERVICES.length,
    portfolio: DEFAULT_PORTFOLIO.length,
    blog: DEFAULT_BLOG.length,
    testimonials: DEFAULT_TESTIMONIALS.length,
    team: DEFAULT_TEAM.length,
  }
}
