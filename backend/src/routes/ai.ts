import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireAuth } from "../middleware/auth";
import Item from "../models/Item";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Require login for all AI routes
router.use(requireAuth);

// =========================================================================
// 🧠 THE BRAIN OF YOUR AI PLATFORM
// Every single tool gets its own highly specific "System Prompt"
// =========================================================================
const systemPrompts: Record<string, string> = {
  "mock-interview":
    "You are a senior FAANG engineering manager conducting a rigorous behavioral interview. The user will provide a scenario or answer. You must critique their answer using the STAR method, point out weaknesses, and provide a 10/10 example answer.",
  "system-design":
    "You are a Principal Systems Architect. The user will provide a system design prompt or idea. You must evaluate it for scalability, single points of failure, database choice, and give a highly technical critique.",
  "bullet-enhancer":
    "You are an elite Silicon Valley tech recruiter. The user will provide a weak resume bullet point. Rewrite it into 3 different highly impactful, metric-driven bullet points that will easily pass ATS filters.",
  "ats-matcher":
    "You are an expert ATS (Applicant Tracking System) algorithm. The user will provide their resume summary and a job description. Analyze the match percentage, identify missing keywords, and suggest exact phrases to add.",
  "magic-cover-letter":
    "You are an expert career coach. The user will provide their background. Write a concise, highly engaging, non-robotic cover letter that hooks the reader in the very first sentence.",
  "cold-email":
    "You are a master of networking. Write a short, punchy cold email for LinkedIn to a hiring manager that asks for a 15-minute coffee chat. It must be under 100 words.",
};

// =========================================================================
// 🚀 DYNAMIC GENERATOR ROUTE
// =========================================================================
router.post("/generate", async (req, res) => {
  try {
    const { prompt, toolSlug } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt required" });

    // Look up the specific role based on the tool they clicked!
    // If they clicked a tool we haven't written a prompt for yet, it uses this smart default:
    const roleInstruction =
      systemPrompts[toolSlug] ||
      "You are an elite career coach and technical assistant for software engineers. Provide a highly detailed, professional response.";

    // We use gemini-1.0-pro with v1 to ensure 100% stability and zero 404 errors!
    // Upgraded to the absolute newest model!
    const model = genAI.getGenerativeModel(
      { model: "gemini-3.5-flash" },
      { apiVersion: "v1beta" },
    );

    // We secretly inject the massive role instruction right before their prompt!
    const fullPrompt = `${roleInstruction}\n\nUser Input: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    res.json({ output: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Generation Failed" });
  }
});

// =========================================================================
// 🎁 RECOMMENDATIONS ROUTE
// =========================================================================
router.post("/recommendations", async (req, res) => {
  try {
    const { viewedItemIds } = req.body;
    const viewedItems = await Item.find({ _id: { $in: viewedItemIds } });
    const categories = viewedItems.map((item) => item.category);

    const recs = await Item.find({
      category: { $in: categories },
      _id: { $nin: viewedItemIds },
    }).limit(4);

    res.json(recs);
  } catch (error) {
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

export default router;
