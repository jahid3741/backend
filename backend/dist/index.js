"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load environment variables
dotenv_1.default.config();
// Routes
const items_1 = __importDefault(require("./routes/items"));
const ai_1 = __importDefault(require("./routes/ai"));
const admin_1 = __importDefault(require("./routes/admin"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Allowed Frontend Origins
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://ai-project-alpha-amber.vercel.app",
];
// Middleware
app.use((0, cors_1.default)({
    origin(origin, callback) {
        // Allow requests without an Origin header (e.g. Postman)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(express_1.default.json());
// MongoDB Connection
if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is missing in your .env file");
}
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
});
// Routes
app.use("/api/items", items_1.default);
app.use("/api/ai", ai_1.default);
app.use("/api/admin", admin_1.default);
app.use("/api/dashboard", dashboard_1.default);
// Root Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Genova API is running smoothly!",
    });
});
// Error Handler
app.use((err, req, res, next) => {
    if (err.message === "Unauthenticated") {
        return res.status(401).json({
            error: "Unauthorized: Invalid or missing Clerk token",
        });
    }
    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({
            error: "CORS Error: Origin not allowed",
        });
    }
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
    });
});
