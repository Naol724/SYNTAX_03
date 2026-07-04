import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { connectToDatabase } from "../lib/mongoose"
import { BlogPost, Service, Testimonial, Portfolio, Content, AdminUser } from "../lib/models"

async function seed() {
  await connectToDatabase()

  // Clear existing data
  await BlogPost.deleteMany({})
  await Service.deleteMany({})
  await Testimonial.deleteMany({})
  await Portfolio.deleteMany({})
  await Content.deleteMany({})
  await AdminUser.deleteMany({})

  // Seed Blog Posts
  const blogPosts = [
    {
      title: "Getting Started with Next.js 15",
      slug: "getting-started-with-nextjs-15",
      excerpt: "Learn the new features and improvements in Next.js 15 including the new App Router and Server Components.",
      content: "<p>Next.js 15 brings exciting new features...</p>",
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
      excerpt: "Best practices for building production-ready APIs that can handle millions of requests.",
      content: "<p>Building scalable APIs requires careful planning...</p>",
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
      excerpt: "How AI is transforming the way we write code and build software applications.",
      content: "<p>AI is revolutionizing software development...</p>",
      featuredImage: "",
      category: "Technology",
      tags: ["AI", "Machine Learning", "Future"],
      author: "Syntax Team",
      published: true,
      featured: true,
      views: 0,
    },
  ]

  await BlogPost.insertMany(blogPosts)
  console.log("✅ Seeded blog posts")

  // Seed Services
  const services = [
    {
      name: "Website Development",
      description: "Modern, responsive websites built with Next.js and React",
      icon: "🌐",
      price: "Starting at $500",
      category: "Web",
      active: true,
      featured: true,
      order: 1,
    },
    {
      name: "Mobile App Development",
      description: "Cross-platform mobile apps with React Native",
      icon: "📱",
      price: "Starting at $1000",
      category: "Mobile",
      active: true,
      featured: true,
      order: 2,
    },
    {
      name: "Enterprise Systems",
      description: "Custom business solutions and ERP systems",
      icon: "🏢",
      price: "Custom Quote",
      category: "Enterprise",
      active: true,
      featured: false,
      order: 3,
    },
  ]

  await Service.insertMany(services)
  console.log("✅ Seeded services")

  // Seed Testimonials
  const testimonials = [
    {
      name: "Abebe Kebede",
      company: "Ethio Tech Solutions",
      content: "SYNTAX transformed our digital presence. 300% growth in online engagement!",
      rating: 5,
      active: true,
      featured: true,
      order: 1,
    },
    {
      name: "Kebede Alemu",
      company: "Digital Ethiopia",
      content: "Game-changer! Our mobile app increased user base by 250%.",
      rating: 5,
      active: true,
      featured: true,
      order: 2,
    },
  ]

  await Testimonial.insertMany(testimonials)
  console.log("✅ Seeded testimonials")

  // Seed Portfolio
  const portfolio = [
    {
      title: "E-Commerce Platform",
      slug: "ecommerce-platform",
      description: "Full-featured online store with payment integration",
      category: "Web",
      images: [],
      thumbnail: "",
      client: "Retail Ethiopia",
      technologies: ["Next.js", "Stripe", "MongoDB"],
      featured: true,
      active: true,
      order: 1,
    },
    {
      title: "Food Delivery App",
      slug: "food-delivery-app",
      description: "Mobile app for food ordering and delivery",
      category: "Mobile",
      images: [],
      thumbnail: "",
      client: "Addis Eats",
      technologies: ["React Native", "Firebase", "Node.js"],
      featured: true,
      active: true,
      order: 2,
    },
  ]

  await Portfolio.insertMany(portfolio)
  console.log("✅ Seeded portfolio")

  // Seed Content
  const content = [
    {
      section: "hero",
      key: "title",
      value: "Building the Digital Future of Ethiopia",
      type: "text",
      description: "Main hero title",
    },
    {
      section: "hero",
      key: "subtitle",
      value: "Full-stack software company delivering websites, mobile apps, gaming platforms, enterprise systems, and AI-powered bots",
      type: "textarea",
      description: "Hero subtitle",
    },
  ]

  await Content.insertMany(content)
  console.log("✅ Seeded content")

  // Seed Admin User
  const defaultAdmin = {
    name: "Admin User",
    email: "admin@syntaxsoftwaresolution.com",
    password: "adminpassword",
    role: "admin",
  }
  await AdminUser.create(defaultAdmin)
  console.log("✅ Seeded admin user")

  console.log("\n🎉 Database seeded successfully!")
  process.exit(0)
}

seed().catch((error) => {
  console.error("Error seeding database:", error)
  process.exit(1)
})
