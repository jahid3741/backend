"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Item_1 = __importDefault(require("./models/Item"));
dotenv_1.default.config();
const seedItems = [
    {
        title: "AI SEO Blog Writer",
        description: "An advanced prompt template designed to generate highly optimized, long-form blog posts that rank on Google.",
        image: "https://picsum.photos/seed/seo/400/300",
        price: 19.99,
        rating: 4.8,
        category: "Templates",
    },
    {
        title: "Social Media Content Calendar",
        description: "Generate 30 days of engaging LinkedIn and Twitter posts with a single click using this custom AI template.",
        image: "https://picsum.photos/seed/social/400/300",
        price: 14.5,
        rating: 4.5,
        category: "Templates",
    },
    {
        title: "Cold Email Outreach Pro",
        description: "High-converting B2B cold email templates specifically tuned for GPT-4 to maximize your response rates.",
        image: "https://picsum.photos/seed/email/400/300",
        price: 29.0,
        rating: 4.9,
        category: "Templates",
    },
    {
        title: "Landing Page Copywriter",
        description: "Instantly draft hero sections, feature lists, and CTAs that convert visitors into paying customers.",
        image: "https://picsum.photos/seed/landing/400/300",
        price: 24.99,
        rating: 4.7,
        category: "Templates",
    },
    {
        title: "YouTube Script Generator",
        description: "A specialized prompt structure for creating engaging, high-retention YouTube video scripts.",
        image: "https://picsum.photos/seed/youtube/400/300",
        price: 12.99,
        rating: 4.3,
        category: "Templates",
    },
    {
        title: "AI Image Prompt Enhancer",
        description: "A utility tool that takes basic ideas and expands them into hyper-detailed prompts for Midjourney and DALL-E 3.",
        image: "https://picsum.photos/seed/image/400/300",
        price: 39.0,
        rating: 5.0,
        category: "Tools",
    },
    {
        title: "Chatbot Personality Customizer",
        description: "Easily configure the tone, humor, and strictness of your custom GPTs with this JSON tool.",
        image: "https://picsum.photos/seed/bot/400/300",
        price: 15.0,
        rating: 4.2,
        category: "Tools",
    },
    {
        title: "Code Review Assistant",
        description: "An automated script that runs your code through AI to find bugs, security flaws, and suggest refactors.",
        image: "https://picsum.photos/seed/code/400/300",
        price: 49.99,
        rating: 4.8,
        category: "Tools",
    },
    {
        title: "Notion AI Workflow Automator",
        description: "Pre-built Notion templates injected with AI prompts to automatically summarize your meeting notes.",
        image: "https://picsum.photos/seed/notion/400/300",
        price: 22.5,
        rating: 4.6,
        category: "Tools",
    },
    {
        title: "Data Analysis Prompt Suite",
        description: "Turn raw CSV data into beautiful charts and insights using this advanced code-interpreter prompt suite.",
        image: "https://picsum.photos/seed/data/400/300",
        price: 35.0,
        rating: 4.9,
        category: "Tools",
    },
    {
        title: "Mastering Midjourney V6",
        description: "A comprehensive 100-page ebook covering lighting, camera angles, and hyper-realism in AI art.",
        image: "https://picsum.photos/seed/midjourney/400/300",
        price: 18.0,
        rating: 4.7,
        category: "Learning",
    },
    {
        title: "Prompt Engineering 101",
        description: "A beginner-friendly video course on how to talk to AI models to get exactly what you want.",
        image: "https://picsum.photos/seed/course/400/300",
        price: 89.99,
        rating: 4.9,
        category: "Learning",
    },
    {
        title: "Building LLM Apps with Next.js",
        description: "Learn how to build full-stack AI applications like Genova in this premium crash course.",
        image: "https://picsum.photos/seed/nextjs/400/300",
        price: 120.0,
        rating: 5.0,
        category: "Learning",
    },
    {
        title: "AI for Marketers (Ebook)",
        description: "Discover how top agencies are using AI to cut content creation time in half without losing quality.",
        image: "https://picsum.photos/seed/marketing/400/300",
        price: 25.0,
        rating: 4.4,
        category: "Learning",
    },
    {
        title: "Advanced ChatGPT Techniques",
        description: "Unlock the hidden potential of custom instructions and knowledge bases in ChatGPT Plus.",
        image: "https://picsum.photos/seed/chatgpt/400/300",
        price: 45.0,
        rating: 4.8,
        category: "Learning",
    },
    {
        title: "500+ SaaS Idea Prompts",
        description: "A massive swipe file of micro-SaaS ideas generated by AI, categorized by industry and difficulty.",
        image: "https://picsum.photos/seed/saas/400/300",
        price: 9.99,
        rating: 4.1,
        category: "Content",
    },
    {
        title: "The Ultimate UX/UI Prompts",
        description: "A library of prompts to help designers generate user personas, journey maps, and wireframe concepts.",
        image: "https://picsum.photos/seed/ux/400/300",
        price: 16.0,
        rating: 4.5,
        category: "Content",
    },
    {
        title: "E-commerce Product Descriptions",
        description: "Copy-and-paste prompts that turn boring product specs into exciting, sales-driven copy.",
        image: "https://picsum.photos/seed/ecommerce/400/300",
        price: 11.5,
        rating: 4.3,
        category: "Content",
    },
    {
        title: "Real Estate Listing Generator",
        description: "Helps realtors write engaging property descriptions that highlight key features and local amenities.",
        image: "https://picsum.photos/seed/realestate/400/300",
        price: 14.0,
        rating: 4.2,
        category: "Content",
    },
    {
        title: "Creative Fiction Writing Prompts",
        description: "Over 1,000 AI-generated scenario prompts to beat writer's block and spark your next novel.",
        image: "https://picsum.photos/seed/fiction/400/300",
        price: 5.99,
        rating: 4.6,
        category: "Content",
    },
];
const seedDatabase = async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await mongoose_1.default.connect(process.env.MONGO_URI || "");
        console.log("✅ Connected to MongoDB!");
        console.log("🧹 Clearing old items...");
        await Item_1.default.deleteMany({});
        console.log("🌱 Planting 20 new items into the database...");
        await Item_1.default.insertMany(seedItems);
        console.log("🎉 Success! Your database is now fully seeded with awesome AI products!");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};
seedDatabase();
//# sourceMappingURL=seed.js.map