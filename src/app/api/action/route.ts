import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    //  ------ Test --------

    const USE_MOCK = true;

    if (USE_MOCK) {
      // Return hardcoded mock data matching your expected format
      return NextResponse.json({
        resources: {
          results: [
            {
              title: "Using Python & Django with Neon's Serverless Postgres",
              url: "https://neon.com/blog/python-django-and-neons-serverless-postgres",
              snippet:
                "This post will walk you through offer advice on configuring the Django application to get the most from your Postgres database.",
              dateText: "Feb 1, 2024",
            },
            {
              title:
                "Best free tier for a dev project with frequent deployments ...",
              url: "https://www.reddit.com/r/webdev/comments/1p253m7/best_free_tier_for_a_dev_project_with_frequent/",
              snippet:
                "Hey everyone, I'm looking for a free hosting solution for a small dev project and could use some advice. I need to deploy a simple web app ...",
              dateText: "9 months ago",
            },
            {
              title: "Deploying a Django App to Render",
              url: "https://testdriven.io/blog/django-render/",
              snippet:
                "This tutorial looks at how to deploy a Django application to Render. In this tutorial, we'll be deploying a simple image hosting application ...",
              dateText: "Dec 15, 2022",
            },
          ],
          generatedAt: "2026-08-29T10:15:12.152Z",
        },
      });
    }

    //  ------ Test --------

    if (!query) {
      return NextResponse.json(
        { error: "Query is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.DEEPAPI_API_KEY;

    if (!apiKey) {
      console.warn(
        "DEEPAPI_API_KEY is not set. Action Engine cannot fetch live resources.",
      );
      return NextResponse.json(
        { error: "Action Engine is not configured (missing API key)." },
        { status: 500 },
      );
    }

    const response = await fetch("https://deepapi.co/v1/search/web", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
      { status: 500 },
    );
  }
}
