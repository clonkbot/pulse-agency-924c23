import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.db.query("stats").collect();
    return stats.sort((a, b) => a.order - b.order);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("stats").first();
    if (existing) return "Stats already seeded";

    const stats = [
      { label: "Clients Served", value: "127+", order: 1 },
      { label: "Campaigns Launched", value: "450+", order: 2 },
      { label: "Revenue Generated", value: "$24M+", order: 3 },
      { label: "Team Members", value: "32", order: 4 },
    ];

    for (const stat of stats) {
      await ctx.db.insert("stats", stat);
    }

    return "Stats seeded successfully";
  },
});
