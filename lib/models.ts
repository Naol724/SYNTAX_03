import mongoose from "mongoose"

// Admin User Model
const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now },
})

AdminUserSchema.methods.comparePassword = async function (password: string) {
  // In production, use bcrypt for password hashing
  return this.password === password
}

// Booking Model
const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  preferredTime: { type: String, required: true },
  message: { type: String },
  status: { type: String, default: "pending", enum: ["pending", "confirmed", "completed", "cancelled"] },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Lead Model
const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  interest: { type: String, required: true },
  source: { type: String, default: "website" },
  message: { type: String },
  status: { type: String, default: "new", enum: ["new", "contacted", "qualified", "converted", "lost"] },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Blog Post Model
const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  featuredImage: { type: String },
  category: { type: String },
  tags: [{ type: String }],
  author: { type: String },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Comment Model
const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

// Service Model
const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  price: { type: String },
  category: { type: String },
  active: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Testimonial Model
const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String },
  content: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  image: { type: String },
  active: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

// Portfolio Model
const PortfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  thumbnail: { type: String },
  client: { type: String },
  technologies: [{ type: String }],
  projectUrl: { type: String },
  githubUrl: { type: String },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Gallery Model
const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  category: { type: String },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

// Content Model (CMS)
const ContentSchema = new mongoose.Schema({
  section: { type: String, required: true },
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, default: "text" },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Team Member Model
const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  linkedin: { type: String },
  github: { type: String },
  twitter: { type: String },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

// Newsletter Model
const NewsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  active: { type: Boolean, default: true },
  source: { type: String, default: "website" },
  createdAt: { type: Date, default: Date.now },
})

// FAQ Model
const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

// Analytics Model
const AnalyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  pageViews: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  bookings: { type: Number, default: 0 },
  leads: { type: Number, default: 0 },
  blogViews: { type: Number, default: 0 },
})

// Export models
export const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema)
export const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)
export const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema)
export const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema)
export const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema)
export const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema)
export const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema)
export const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema)
export const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema)
export const Content = mongoose.models.Content || mongoose.model("Content", ContentSchema)
export const TeamMember = mongoose.models.TeamMember || mongoose.model("TeamMember", TeamMemberSchema)
export const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", NewsletterSchema)
export const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema)
export const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema)
