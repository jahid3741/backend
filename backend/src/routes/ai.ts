import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireAuth } from "../middleware/auth";
import Item from "../models/Item";

const router = Router();

// Check API Key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Protect all AI routes
// router.use(requireAuth);

// ==========================================================
// AI SYSTEM PROMPTS
// ==========================================================
const systemPrompts: Record<string, string> = {
  "mock-interview":
    "You are a senior FAANG engineering manager. Conduct a realistic behavioral interview. Critique answers using the STAR method and provide an ideal answer.",

  "system-design":
    "You are a Principal Software Architect. Review the user's design, discuss scalability, bottlenecks, databases, caching, load balancing, APIs and security.",

  "bullet-enhancer":
    "You are a Silicon Valley recruiter. Rewrite weak resume bullet points into powerful ATS-friendly achievements with metrics.",

  "ats-matcher":
    "You are an ATS system. Compare the user's resume with the job description, calculate an approximate ATS score, list missing keywords and improvements.",

  "magic-cover-letter":
    "Write a modern, personalized and professional cover letter that sounds human and persuasive.",

  "cold-email":
    "Write a concise networking email under 100 words that encourages a hiring manager to reply.",
};

// ==========================================================
// AI GENERATOR
// ==========================================================
router.post("/generate", async (req, res) => {
  try {
    console.log("========== AI REQUEST ==========");
    console.log(req.body);
    console.log("===============================");

    const { prompt, toolSlug } = req.body;

    return res.json({
      success: true,
      output: `Backend received:
Prompt = ${prompt}

Tool = ${toolSlug}`,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
});

// ==========================================================
// SMART RECOMMENDATIONS
// ==========================================================
router.post("/recommendations", async (req, res) => {
  try {
    const { viewedItemIds } = req.body;

    if (!Array.isArray(viewedItemIds)) {
      return res.status(400).json({
        success: false,
        error: "viewedItemIds must be an array.",
      });
    }

    const viewedItems = await Item.find({
      _id: {
        $in: viewedItemIds,
      },
    });

    const categories = viewedItems.map((item) => item.category);

    const recommendations = await Item.find({
      category: {
        $in: categories,
      },
      _id: {
        $nin: viewedItemIds,
      },
    }).limit(4);

    return res.status(200).json({
      success: true,
      recommendations,
    });
  } catch (error: any) {
    console.error("Recommendation Error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to get recommendations.",
    });
  }
});

export default router;
