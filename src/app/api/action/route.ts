import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPAPI_API_KEY;
    
    if (!apiKey) {
      console.warn("DEEPAPI_API_KEY is not set. Action Engine cannot fetch live resources.");
      return NextResponse.json(
        { error: "Action Engine is not configured (missing API key)." },
        { status: 500 }
      );
    }

    const response = await fetch("https://deepapi.co/v1/search/web", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        query: query,
        maxResults: 3,
        maxCostUsd: "0.05",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepAPI Error:", response.status, errorText);
      throw new Error(`Failed to fetch from DeepAPI: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse the .output array from the response
    return NextResponse.json({
      resources: data.output || [],
    });

  } catch (error) {
    console.error("Error fetching live resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch live resources. Please try again." },
      { status: 500 }
    );
  }
}
