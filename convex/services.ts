import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("services")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const listByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const services = await ctx.db
      .query("services")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();

    return services.filter(s => s.isActive).sort((a, b) => a.order - b.order);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if services already exist
    const existing = await ctx.db.query("services").first();
    if (existing) return "Services already seeded";

    const services = [
      // Marketing Services
      {
        category: "marketing",
        title: "Meme Marketing",
        description: "Viral content that speaks the internet's language. We craft memes that resonate, engage, and convert.",
        features: ["Custom meme creation", "Trend hijacking", "Community building", "Viral campaign strategy"],
        price: "From $2,500/mo",
        isActive: true,
        order: 1,
      },
      {
        category: "marketing",
        title: "Influencer Marketing",
        description: "Strategic partnerships with creators who move markets. Authentic reach at scale.",
        features: ["Influencer vetting", "Campaign management", "Performance tracking", "ROI optimization"],
        price: "From $5,000/mo",
        isActive: true,
        order: 2,
      },
      {
        category: "marketing",
        title: "GIF Marketing",
        description: "Motion that captures attention. Custom GIFs for brand moments that stick.",
        features: ["Branded GIF creation", "GIPHY integration", "Reaction GIF packs", "Animation series"],
        price: "From $1,500/mo",
        isActive: true,
        order: 3,
      },
      // Development Services
      {
        category: "development",
        title: "Web Development",
        description: "Lightning-fast, beautifully crafted web experiences. From landing pages to full platforms.",
        features: ["React/Next.js", "Real-time features", "E-commerce", "API integrations"],
        price: "From $10,000",
        isActive: true,
        order: 1,
      },
      {
        category: "development",
        title: "Automation",
        description: "Eliminate repetitive tasks. We build systems that work while you sleep.",
        features: ["Workflow automation", "Data pipelines", "Bot development", "System integration"],
        price: "From $3,000",
        isActive: true,
        order: 2,
      },
      {
        category: "development",
        title: "Debugging & Optimization",
        description: "Fix what's broken. Speed up what's slow. We diagnose and resolve technical debt.",
        features: ["Performance audits", "Bug fixing", "Code refactoring", "Load optimization"],
        price: "From $150/hr",
        isActive: true,
        order: 3,
      },
      // SEO Services
      {
        category: "seo",
        title: "Technical SEO",
        description: "Foundation-level optimization. Make your site irresistible to search engines.",
        features: ["Site audits", "Schema markup", "Core Web Vitals", "Crawl optimization"],
        price: "From $2,000/mo",
        isActive: true,
        order: 1,
      },
      {
        category: "seo",
        title: "Content SEO",
        description: "Content that ranks and converts. Strategic keyword targeting with editorial quality.",
        features: ["Keyword research", "Content strategy", "On-page optimization", "Link building"],
        price: "From $3,500/mo",
        isActive: true,
        order: 2,
      },
      {
        category: "seo",
        title: "Local SEO",
        description: "Dominate your local market. Be found when and where it matters most.",
        features: ["Google Business optimization", "Local citations", "Review management", "Map pack ranking"],
        price: "From $1,500/mo",
        isActive: true,
        order: 3,
      },
    ];

    for (const service of services) {
      await ctx.db.insert("services", service);
    }

    return "Services seeded successfully";
  },
});
