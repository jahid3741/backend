import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import Item from "../models/Item";

const router = Router();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing.");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemPrompts: Record<string, string> = {
  "mock-interview":
    "You are a senior FAANG engineering manager. Conduct a realistic behavioral interview. Critique answers using the STAR method and provide an ideal answer.",

  "system-design":
    "You are a Principal Software Architect. Review the user's design, discuss scalability, bottlenecks, databases, caching, APIs, security and scaling.",

  "bullet-enhancer":
    "You are an elite Silicon Valley recruiter. Rewrite weak resume bullet points into strong ATS-friendly bullet points with measurable impact.",

  "ats-matcher":
    "You are an ATS resume analyzer. Compare the resume against the job description, calculate an ATS score, identify missing keywords and suggest improvements.",

  "magic-cover-letter":
    "Write a personalized professional cover letter that sounds natural and persuasive.",

  "cold-email":
    "Write a concise networking email under 100 words that encourages a hiring manager to reply.",
};

// ====================================================
// AI GENERATOR
// ====================================================

router.post("/generate", async (req, res) => {
  try {
    const { prompt, toolSlug } = req.body;

    if (!prompt || !toolSlug) {
      return res.status(400).json({
        success: false,
        error: "Prompt and toolSlug are required.",
      });
    }

    const systemPrompt =
      systemPrompts[toolSlug] ??
      "You are a helpful AI assistant.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}

User Request:

${prompt}`,
    });

    return res.json({
      success: true,
      output: response.text,
    });
  } catch (error: any) {
    console.error("Gemini Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ====================================================
// RECOMMENDATIONS
// ====================================================

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
      _id: { $in: viewedItemIds },
    });

    const categories = viewedItems.map(
      (item) => item.category
    );

    const recommendations = await Item.find({
      category: { $in: categories },
      _id: { $nin: viewedItemIds },
    }).limit(4);

    return res.json({
      success: true,
      recommendations,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Failed to load recommendations.",
    });
  }
});

export default router;