import { Router } from "express";
import Item from "../models/Item";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/items (Search, filter, sort, pagination) - Public
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      page = "1",
      limit = "10",
    } = req.query;

    const query: any = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (category && category !== "all") query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOpt: any = {};
    if (sortBy === "price-low") sortOpt.price = 1;
    else if (sortBy === "price-high") sortOpt.price = -1;
    else if (sortBy === "newest") sortOpt.date = -1;
    else sortOpt.rating = -1; // default 'popular'

    const skip = (Number(page) - 1) * Number(limit);

    const items = await Item.find(query)
      .sort(sortOpt)
      .skip(skip)
      .limit(Number(limit));
    const total = await Item.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// GET /api/items/:id - Public
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error fetching item" });
  }
});

// POST /api/items - ADMIN ONLY
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: "Failed to create item" });
  }
});

// PUT /api/items/:id - ADMIN ONLY
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to update item" });
  }
});

// DELETE /api/items/:id - ADMIN ONLY
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete item" });
  }
});

export default router;
