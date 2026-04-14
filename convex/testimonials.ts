import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("testimonials")
      .withIndex("by_visible", (q) => q.eq("isVisible", true))
      .collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("testimonials").first();
    if (existing) return "Testimonials already seeded";

    const testimonials = [
      {
        clientName: "Sarah Chen",
        clientRole: "CMO",
        clientCompany: "TechFlow",
        content: "PULSE turned our brand into a meme machine. 340% increase in engagement within 60 days.",
        rating: 5,
        isVisible: true,
        createdAt: Date.now() - 86400000 * 30,
      },
      {
        clientName: "Marcus Webb",
        clientRole: "Founder",
        clientCompany: "DeFi Labs",
        content: "Their dev team shipped our entire platform in 6 weeks. Flawless execution.",
        rating: 5,
        isVisible: true,
        createdAt: Date.now() - 86400000 * 20,
      },
      {
        clientName: "Lisa Park",
        clientRole: "Growth Lead",
        clientCompany: "Nexus AI",
        content: "SEO results exceeded projections by 200%. First page rankings in 90 days.",
        rating: 5,
        isVisible: true,
        createdAt: Date.now() - 86400000 * 10,
      },
    ];

    for (const testimonial of testimonials) {
      await ctx.db.insert("testimonials", testimonial);
    }

    return "Testimonials seeded successfully";
  },
});
