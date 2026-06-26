import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import User from "../models/User";
import Item from "../models/Item";

const router = Router();

// Lock down all admin routes!
router.use(requireAuth, requireAdmin);

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();

    res.json({
      totalUsers,
      totalItems,
      revenue: 45231, // Mocked for now
      activeSessions: Math.floor(Math.random() * 500),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 }).limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
