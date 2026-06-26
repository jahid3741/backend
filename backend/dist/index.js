"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load Environment Variables first!
dotenv_1.default.config();
// Import all our structured routes
const items_1 = __importDefault(require("./routes/items"));
const ai_1 = __importDefault(require("./routes/ai"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Middleware
app.use((0, cors_1.default)({ origin: "http://localhost:3000" })); // Lets Next.js talk to us
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI || "")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
// Hook up the routes
app.use("/api/items", items_1.default);
app.use("/api/ai", ai_1.default);
app.use("/api/admin", admin_1.default);
app.get("/", (req, res) => {
    res.json({ message: "Genova API is running smoothly!" });
});
// Error handling for Clerk Authentication failures
app.use((err, req, res, next) => {
    if (err.message === "Unauthenticated") {
        return res
            .status(401)
            .json({ error: "Unauthorized: Invalid or missing Clerk token" });
    }
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});
// Start the engine
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
