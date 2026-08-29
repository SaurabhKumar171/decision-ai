# Personal Decision Assistant 🧭

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)
![SkillPatch](https://img.shields.io/badge/SkillPatch-0F172A?style=for-the-badge&logo=abstract&logoColor=white)
![LatentCode](https://img.shields.io/badge/LatentCode-5C2D91?style=for-the-badge)

## ⚠️ The Problem & Our Solution
**Decision Fatigue is Real.** When facing a complex career move, technology choice, or learning path, search engines give you 100 tabs of conflicting opinions. Chatbots give you bulleted lists of "options" that leave the final choice squarely back on your shoulders.

**The Solution:** The Personal Decision Assistant is an anti-analysis-paralysis engine. You input your skills, your goal, and your constraints. It evaluates the landscape and makes **ONE definitive choice** for you, explains the trade-offs it accepted on your behalf, and immediately goes out to the live web to fetch the actionable resources you need to execute that decision today.

---

## 🏗️ Architecture

The application is powered by a high-speed, two-tier AI architecture:

### 1. The Brain: Gemini 3.5 Decision Engine
Handles the initial evaluation phase. It takes your highly specific context (skills + goals + constraints) and synthesizes a single, optimal path. It explicitly surfaces the "Why It Fits" and the pragmatic "Trade-offs Accepted".

### 2. The Hands: SkillPatch / DeepAPI Action Engine
Once the decision is made, the engine doesn't leave you hanging. It autonomously utilizes the **pi-web-search** skill via **DeepAPI** to scrape the live web, curating 4 highly relevant, up-to-date resources (courses, documentation, or tools) required to execute the recommendation.

---

## ✨ Key Features

- 🌓 **Split-Screen Dashboard:** A beautiful, responsive, glassmorphic UI utilizing Framer Motion for smooth state transitions between input and synthesis.
- 🚀 **1-Click Preset Scenarios:** Not sure where to start? Click a preset (e.g., "Analyst to ML", "Solo SaaS Stack") to instantly test the engine's capabilities.
- 🕸️ **Automatic Resource Scraping:** Real-time web scraping to find the exact tools and tutorials you need for your chosen path, rather than hallucinated links.
- 📄 **1-Click PDF Export:** Generate a beautifully formatted, A4-ready "Decision Memo" PDF of your results for offline reading or sharing with stakeholders, featuring perfect text alignment and zero clipping.

---

## 🏆 Hackathon Rules Compliance

**BuildSprint 2026**

- **100% AI-Generated Codebase:** We explicitly state that 100% of the code in this repository was written using **LatentCode** as the sole AI coding harness. No manual coding or alternative AI assistants were utilized.
- **SkillPatch Integration:** This project successfully integrates and leverages the following official SkillPatch skills to accomplish its goals:
  - `deepapi`
  - `pi-web-search`

---

## 🔮 Vision & Multi-Domain Roadmap
While the current MVP focuses on tech careers and education paths, **DecisionMind AI** is architected as a domain-agnostic decision engine. 

The core two-tier framework (Gemini reasoning engine + SkillPatch action execution) can scale to any domain where choice paralysis occurs:
* 💼 **Career & Education (Current):** Navigating role pivots, skill roadmaps, and interview strategy.
* 💰 **Personal Finance & Investments:** Evaluating asset allocations, budget trade-offs, and tool selection.
* 🏋️ **Health & Wellness:** Structuring personalized training regimens, diet trade-offs, and supplement stacks.
* 🏗️ **Architecture & Tech Stacks:** Selecting enterprise cloud infrastructure, frameworks, and database choices.

*“One Decision. Zero Fluff.”*