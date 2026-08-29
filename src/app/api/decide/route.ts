import { NextResponse } from "next/server";
import { generateObject } from "ai";
// import { openai } from "@ai-sdk/openai";
// import { z } from "zod";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const maxDuration = 30;

const decisionSchema = z.object({
  primaryRecommendation: z
    .string()
    .describe("The single, definitive recommended course of action."),
  whyItFits: z
    .string()
    .describe(
      "A concise explanation of why this is the best recommendation given the user's skills and constraints.",
    ),
  tradeoffsAccepted: z
    .array(z.string())
    .describe(
      "A list of 2-3 compromises or sacrifices being made by choosing this recommendation.",
    ),
});

export async function POST(req: Request) {
  try {
    const { skills, goal, constraints } = await req.json();

    if (!skills || !goal) {
      return NextResponse.json(
        { error: "Skills and goal are required." },
        { status: 400 },
      );
    }

    const { object } = await generateObject({
      // model: openai("gpt-4o"),
      model: google("gemini-3.5-flash"),
      schema: decisionSchema,
      prompt: `You are a decisive Personal Decision Assistant. The user needs clear, confident, and definitive guidance. Do NOT provide multiple options or equivocate. Give exactly ONE definitive recommendation based on their inputs.
      
      Here is the user's situation:
      - Current Skills & Assets: ${skills}
      - End Goal: ${goal}
      - Constraints & Preferences: ${constraints || "None specified"}

      Analyze these factors and return the single best path forward, explaining why it's the right choice and identifying the exact trade-offs they must accept by taking this path.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("Error generating decision:", error);

    const isRateLimited =
      error?.statusCode === 429 ||
      error?.status === 429 ||
      error?.message?.includes("429") ||
      error?.message?.includes("RESOURCE_EXHAUSTED");

    if (isRateLimited) {
      return NextResponse.json(
        {
          error: "Rate limit reached. The AI service is currently busy.",
          isRateLimited: true,
          retryAfter: 35,
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: "Failed to generate a decision. Please try again." },
      { status: 500 },
    );
  }
}
