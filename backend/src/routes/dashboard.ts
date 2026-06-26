import { Router } from "express";
import Item from "../models/Item"; // Make sure this path is correct for your Item model!

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    // 1. We use MongoDB Aggregation to count exactly how many AI Tools belong to each category!
    const categoryStats = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }, // Sort from highest to lowest
    ]);

    // 2. We format the raw database data so Recharts can read it perfectly
    const chartData = categoryStats.map((stat) => ({
      name: stat._id || "Uncategorized",
      value: stat.count,
    }));

    res.json(chartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch dynamic chart stats" });
  }
});

export default router;
