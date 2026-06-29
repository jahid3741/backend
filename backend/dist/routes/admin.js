"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const Item_1 = __importDefault(require("../models/Item"));
const router = (0, express_1.Router)();
// Lock down all admin routes!
router.use(auth_1.requireAuth, auth_1.requireAdmin);
router.get("/stats", async (req, res) => {
    try {
        const totalUsers = await User_1.default.countDocuments();
        const totalItems = await Item_1.default.countDocuments();
        res.json({
            totalUsers,
            totalItems,
            revenue: 45231, // Mocked for now
            activeSessions: Math.floor(Math.random() * 500),
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});
router.get("/users", async (req, res) => {
    try {
        const users = await User_1.default.find().sort({ _id: -1 }).limit(20);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
exports.default = router;
