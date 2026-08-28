"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [skills, setSkills] = useState("");
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [decision, setDecision] = useState<{
    primaryRecommendation: string;
    whyItFits: string;
    tradeoffsAccepted: string[];
  } | null>(null);

  const [isFetchingResources, setIsFetchingResources] = useState(false);
  const [resources, setResources] = useState<
    | {
        title: string;
        url: string;
        snippet: string;
      }[]
    | null
  >(null);
  const [resourceError, setResourceError] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDecision(null);
    setResources(null);
    setResourceError("");
    setError("");

    try {
      const response = await fetch("/api/decide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills, goal, constraints }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate decision");
      }

      const data = await response.json();
      setDecision(data);
    } catch (err) {
      setError("Oops! Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchResources = async () => {
    if (!decision?.primaryRecommendation) return;

    setIsFetchingResources(true);
    setResourceError("");

    try {
      const response = await fetch("/api/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: decision.primaryRecommendation }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resources");
      }

      const data = await response.json();
      setResources(data.resources.results);
    } catch (err) {
      setResourceError("Oops! Couldn't fetch live resources right now.");
      console.error(err);
    } finally {
      setIsFetchingResources(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-8rem)] pb-24">
      <div className="w-full max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Chart Your Course
          </h1>
          <p className="text-lg text-muted-foreground">
            Tell us where you are and where you want to go. We'll map the best
            path.
          </p>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Decision Parameters</CardTitle>
              <CardDescription>
                Provide context for your dilemma to get personalized guidance.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="skills"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Current Skills & Assets
                </label>
                <Input
                  id="skills"
                  placeholder="e.g. React, TypeScript, 3 years experience..."
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="goal"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  End Goal
                </label>
                <Input
                  id="goal"
                  placeholder="e.g. Senior Frontend Engineer role..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="constraints"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Constraints & Preferences
                </label>
                <Textarea
                  id="constraints"
                  placeholder="e.g. Need to learn part-time, budget is $500, looking for remote only..."
                  className="resize-none h-24"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                size="lg"
                className="w-full text-md font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Thinking..." : "Decide for Me"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
            {error}
          </div>
        )}

        {decision && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="bg-primary/10 border-b border-border/50 p-6">
              <h3 className="text-sm font-semibold tracking-wide text-primary uppercase mb-2">
                Our Recommendation
              </h3>
              <p className="text-xl font-medium leading-relaxed">
                {decision.primaryRecommendation}
              </p>
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Why It Fits
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {decision.whyItFits}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-500"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                  Trade-offs You're Accepting
                </h4>
                <ul className="space-y-2">
                  {decision.tradeoffsAccepted.map((tradeoff, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/40"
                    >
                      <span className="font-medium text-foreground mt-0.5">
                        •
                      </span>
                      <span>{tradeoff}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border/50">
                <Button
                  onClick={handleFetchResources}
                  variant="default"
                  className="w-full font-medium bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isFetchingResources}
                >
                  {isFetchingResources ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Searching the web...
                    </span>
                  ) : (
                    "Fetch Live Resources"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {resourceError && (
          <div className="p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
            {resourceError}
          </div>
        )}

        {resources && resources.length > 0 && (
          <div className="space-y-6 w-full max-w-4xl mx-auto pt-4">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">
                Actionable Resources & Next Steps
              </h3>
              <p className="text-sm text-muted-foreground">
                (Powered by SkillPatch / DeepAPI)
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource, index) => (
                <Card
                  key={index}
                  className="flex flex-col h-full hover:shadow-lg transition-all border-border/60 hover:border-blue-500/30"
                >
                  <CardHeader className="pb-3 flex-none">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {resource.snippet}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border/50 flex-none">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      Open Resource ↗
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
