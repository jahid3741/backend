"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Item_1 = __importDefault(require("../models/Item"));
const router = (0, express_1.Router)();
router.get("/stats", async (req, res) => {
    try {
        const categoryStats = await Item_1.default.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        const chartData = categoryStats.map((stat) => ({
            name: stat._id || "Uncategorized",
            value: stat.count,
        }));
        res.json(chartData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch dynamic chart stats" });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map