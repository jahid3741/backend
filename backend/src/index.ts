import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load Environment Variables first!
dotenv.config();

// Import all our structured routes
import itemRoutes from "./routes/items";
import aiRoutes from "./routes/ai";
import adminRoutes from "./routes/admin";
import dashboardRoutes from "./routes/dashboard";
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: "*", // 🔥 This star allows your Vercel frontend to connect!
    credentials: true,
  }),
); // Lets Next.js talk to us
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Hook up the routes
app.use("/api/items", itemRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Genova API is running smoothly!" });
});

// Error handling for Clerk Authentication failures
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err.message === "Unauthenticated") {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or missing Clerk token" });
    }
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
  },
);

// Start the engine
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
