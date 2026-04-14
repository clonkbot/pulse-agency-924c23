import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Contact form submissions
  inquiries: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    serviceType: v.string(),
    message: v.string(),
    userId: v.optional(v.id("users")),
    status: v.string(), // "new" | "contacted" | "closed"
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),

  // Services offered
  services: defineTable({
    category: v.string(), // "marketing" | "development" | "seo"
    title: v.string(),
    description: v.string(),
    features: v.array(v.string()),
    price: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number(),
  }).index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // Testimonials
  testimonials: defineTable({
    clientName: v.string(),
    clientRole: v.string(),
    clientCompany: v.string(),
    content: v.string(),
    rating: v.number(),
    isVisible: v.boolean(),
    createdAt: v.number(),
  }).index("by_visible", ["isVisible"]),

  // Stats/metrics for the agency
  stats: defineTable({
    label: v.string(),
    value: v.string(),
    order: v.number(),
  }),
});
