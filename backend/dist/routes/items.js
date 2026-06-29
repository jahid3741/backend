"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Item_1 = __importDefault(require("../models/Item"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/items (Search, filter, sort, pagination) - Public
router.get("/", async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sortBy, page = "1", limit = "10", } = req.query;
        const query = {};
        if (search)
            query.title = { $regex: search, $options: "i" };
        if (category && category !== "all")
            query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
        }
        const sortOpt = {};
        if (sortBy === "price-low")
            sortOpt.price = 1;
        else if (sortBy === "price-high")
            sortOpt.price = -1;
        else if (sortBy === "newest")
            sortOpt.date = -1;
        else
            sortOpt.rating = -1; // default 'popular'
        const skip = (Number(page) - 1) * Number(limit);
        const items = await Item_1.default.find(query)
            .sort(sortOpt)
            .skip(skip)
            .limit(Number(limit));
        const total = await Item_1.default.countDocuments(query);
        res.json({
            items,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch items" });
    }
});
// GET /api/items/:id - Public
router.get("/:id", async (req, res) => {
    try {
        const item = await Item_1.default.findById(req.params.id);
        if (!item)
            return res.status(404).json({ error: "Item not found" });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching item" });
    }
});
// POST /api/items - ADMIN ONLY
router.post("/", auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const newItem = await Item_1.default.create(req.body);
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(400).json({ error: "Failed to create item" });
    }
});
// PUT /api/items/:id - ADMIN ONLY
router.put("/:id", auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        const updated = await Item_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: "Failed to update item" });
    }
});
// DELETE /api/items/:id - ADMIN ONLY
router.delete("/:id", auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    try {
        await Item_1.default.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ error: "Failed to delete item" });
    }
});
exports.default = router;
