import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// Routes
import itemRoutes from "./routes/items";
import aiRoutes from "./routes/ai";
import adminRoutes from "./routes/admin";
import dashboardRoutes from "./routes/dashboard";

const app = express();
const PORT = process.env.PORT || 4000;

// Allowed Frontend Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://ai-project-alpha-amber.vercel.app",
];

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header (e.g. Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());

// MongoDB Connection
if (!process.env.MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing in your .env file");
}

mongoose
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
app.use("/api/items", itemRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Genova API is running smoothly!",
  });
});

// Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
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
  },
);
