"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Target,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Loader2,
  Sparkles,
  Compass,
  Zap,
  Code2,
  GraduationCap,
  Network,
  Copy,
  RotateCcw,
  X,
  Download,
} from "lucide-react";
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
  const [error, setError] = useState("");
  const [hasCopied, setHasCopied] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const [decision, setDecision] = useState<{
    primaryRecommendation: string;
    whyItFits: string;
    tradeoffsAccepted: string[];
  } | null>(null);

  const [resources, setResources] = useState<
    | {
        title: string;
        url: string;
        snippet: string;
      }[]
    | null
  >(null);
  const [isFetchingResources, setIsFetchingResources] = useState(false);
  const [resourceError, setResourceError] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // Auto-trigger Effect
  useEffect(() => {
    if (decision?.primaryRecommendation && !resources && !isFetchingResources) {
      handleFetchResources(decision.primaryRecommendation);
    }
  }, [decision, resources, isFetchingResources]);

  const handleFetchResources = async (query: string) => {
    setIsFetchingResources(true);
    setResourceError("");

    try {
      const response = await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Failed to fetch resources");

      const data = await response.json();
      setResources(data.resources.results);
    } catch (err) {
      setResourceError("Oops! Couldn't fetch live resources right now.");
      console.error(err);
    } finally {
      setIsFetchingResources(false);
    }
  };

  const executeDecision = async (s: string, g: string, c: string) => {
    if (!s || !g || !c) return;

    setIsLoading(true);
    setDecision(null);
    setResources(null);
    setResourceError("");
    setError("");

    try {
      const response = await fetch("/api/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: s, goal: g, constraints: c }),
      });

      if (!response.ok) throw new Error("Failed to generate decision");

      const data = await response.json();
      setDecision(data);
    } catch (err) {
      setError("Oops! Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeDecision(skills, goal, constraints);
  };

  const handlePreset = (
    presetSkills: string,
    presetGoal: string,
    presetConstraints: string,
  ) => {
    setSkills(presetSkills);
    setGoal(presetGoal);
    setConstraints(presetConstraints);
    executeDecision(presetSkills, presetGoal, presetConstraints);
  };

  const handleReset = () => {
    setSkills("");
    setGoal("");
    setConstraints("");
    setDecision(null);
    setResources(null);
    setError("");
    setResourceError("");
  };

  const copyToClipboard = () => {
    if (!decision) return;
    const text = `Recommendation: ${decision.primaryRecommendation}\n\nWhy it fits: ${decision.whyItFits}\n\nTrade-offs: ${decision.tradeoffsAccepted.join(", ")}`;
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("pdf-export-container");
      
      if (!element) return;
      
      const opt = {
        margin: 10,
        filename: 'Decision_Memo.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] overflow-hidden">
      {/* Dismissible Hero Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.3 }}
            className="w-full relative z-40 border-b border-border/40 bg-background/80 backdrop-blur-md shrink-0"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 relative flex flex-col items-center justify-center text-center">
              <button
                onClick={() => setShowBanner(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-full transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center justify-center p-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md mb-3">
                <span className="flex items-center text-[10px] md:text-xs font-bold uppercase tracking-wider px-2 py-0.5">
                  <span className="mr-1.5 text-sm">⚡</span>
                  Anti-Analysis Paralysis
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/70 pb-2 mb-2">
                One Decision. Zero Fluff.
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed">
                Search engines give you 100 tabs. AI chatbots give you lists of
                options.{" "}
                <strong className="text-foreground">DecisionMind</strong>{" "}
                evaluates your exact constraints and makes ONE definitive choice
                for you.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split-Screen Body Container */}
      <div className="relative flex w-full flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 dark:bg-purple-900/20 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-900/20 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-500/10 dark:bg-pink-900/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
        </div>

        {/* Left Panel */}
        <div className="w-full lg:w-[35%] lg:min-w-[400px] lg:max-w-[480px] border-b lg:border-b-0 lg:border-r border-border/40 bg-background/50 backdrop-blur-sm p-4 md:p-6 lg:p-8 flex flex-col relative z-20 shadow-2xl lg:shadow-none shrink-0 h-full overflow-hidden">
          <div className="space-y-4 md:space-y-6 w-full h-full flex flex-col">
            <div className="flex items-center gap-2 pb-1 shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight">
                Set Trajectory
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative group transition-all duration-300 flex-grow flex flex-col min-h-0"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition duration-500 blur-md pointer-events-none"></div>
              <Card className="relative border-border/50 bg-card/90 backdrop-blur-xl shadow-xl overflow-hidden flex-grow flex flex-col h-full">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 flex-grow overflow-y-auto scrollbar-thin">
                    <div className="space-y-2 relative group/field">
                      <label
                        htmlFor="skills"
                        className="text-sm font-semibold flex items-center gap-2 group-hover/field:text-primary transition-colors"
                      >
                        <Brain className="w-4 h-4 text-purple-500" />
                        Current Skills
                      </label>
                      <Input
                        id="skills"
                        placeholder="e.g. React, 3 YOE"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        required
                        className="h-11 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50 transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-2 relative group/field">
                      <label
                        htmlFor="goal"
                        className="text-sm font-semibold flex items-center gap-2 group-hover/field:text-primary transition-colors"
                      >
                        <Target className="w-4 h-4 text-pink-500" />
                        End Goal
                      </label>
                      <Input
                        id="goal"
                        placeholder="e.g. Senior Engineer"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        required
                        className="h-11 bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50 transition-all shadow-sm"
                      />
                    </div>

                    <div className="space-y-2 relative group/field pb-1">
                      <label
                        htmlFor="constraints"
                        className="text-sm font-semibold flex items-center gap-2 group-hover/field:text-primary transition-colors"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                        Constraints
                      </label>
                      <Textarea
                        id="constraints"
                        placeholder="e.g. Budget is $500, looking for remote..."
                        className="resize-none min-h-[120px] bg-background/50 border-muted-foreground/20 focus-visible:ring-primary/50 transition-all shadow-sm py-2.5"
                        value={constraints}
                        onChange={(e) => setConstraints(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 md:p-6 pt-0 mt-auto shrink-0">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-base font-bold h-12 relative overflow-hidden group/btn bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_20px_rgba(var(--foreground-rgb),0.1)] hover:shadow-[0_0_30px_rgba(var(--foreground-rgb),0.2)] transition-all"
                      disabled={isLoading || isFetchingResources}
                    >
                      {isLoading || isFetchingResources ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center gap-3 w-full"
                        >
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="animate-pulse">
                            {isLoading
                              ? "Synthesizing Optimal Path..."
                              : "Curating Resources..."}
                          </span>
                        </motion.div>
                      ) : (
                        <span className="flex items-center justify-center w-full">
                          Analyze & Decide 🚀
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none"></div>
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Right Panel Canvas */}
        <div className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto scrollbar-thin scroll-smooth relative z-10 h-full w-full">
          <AnimatePresence mode="wait">
            {!isLoading && !decision && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center min-h-full max-w-3xl mx-auto space-y-6 py-8"
              >
                <div className="text-center space-y-6 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center shadow-inner border border-white/10 dark:border-white/5 mb-2 relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse"></div>
                    <Compass className="w-10 h-10 text-primary drop-shadow-md relative z-10" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                      1-Click Demo Presets
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                      Click any scenario below to test the engine instantly.
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handlePreset(
                          "React/Node.js",
                          "FAANG AI Eng",
                          "10 hrs/wk, $500",
                        )
                      }
                      className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-left space-y-3 transition-colors relative overflow-hidden group shadow-sm"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Zap className="w-16 h-16 text-indigo-500 -mr-4 -mt-4 rotate-12" />
                      </div>
                      <div className="font-bold text-foreground flex items-center gap-2 text-lg">
                        <span>🚀</span> FAANG AI Transition
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed relative z-10">
                        Skills: React/Node.js
                        <br />
                        Goal: FAANG AI Eng
                        <br />
                        Constraints: 10 hrs/wk, $500
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handlePreset(
                          "Python/Django",
                          "Launch SaaS in 30 days",
                          "Solo, $0 budget",
                        )
                      }
                      className="p-5 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 text-left space-y-3 transition-colors relative overflow-hidden group shadow-sm"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Code2 className="w-16 h-16 text-purple-500 -mr-4 -mt-4 rotate-12" />
                      </div>
                      <div className="font-bold text-foreground flex items-center gap-2 text-lg">
                        <span>💻</span> Solo SaaS Stack
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed relative z-10">
                        Skills: Python
                        <br />
                        Goal: Launch in 30d
                        <br />
                        Constraints: Solo, $0 budget
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handlePreset(
                          "SQL/Excel",
                          "ML Engineer",
                          "No math bg, self-paced",
                        )
                      }
                      className="p-5 rounded-xl border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 text-left space-y-3 transition-colors relative overflow-hidden group shadow-sm"
                    >
                      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                        <GraduationCap className="w-16 h-16 text-pink-500 -mr-4 -mt-4 rotate-12" />
                      </div>
                      <div className="font-bold text-foreground flex items-center gap-2 text-lg">
                        <span>🎓</span> Analyst to ML
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed relative z-10">
                        Skills: SQL/Excel
                        <br />
                        Goal: ML Engineer
                        <br />
                        Constraints: No math bg
                      </div>
                    </motion.button>
                  </div>
                </div>

                <div className="w-full pt-12 mt-12 border-t border-border/40 flex justify-center">
                  <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-muted-foreground opacity-60">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                      <span>Context Input</span>
                    </div>
                    <div className="h-[2px] w-8 md:w-16 bg-gradient-to-r from-muted to-primary/30"></div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Brain className="w-4 h-4" />
                      </div>
                      <span>Gemini Engine</span>
                    </div>
                    <div className="h-[2px] w-8 md:w-16 bg-gradient-to-r from-primary/30 to-blue-500/30"></div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Network className="w-4 h-4" />
                      </div>
                      <span>SkillPatch Execution</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {(isLoading || decision) && (
              <motion.div
                key="results-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-4xl mx-auto space-y-8"
              >
                {/* Header Actions for Results */}
                <div className="flex items-center justify-between pb-2">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Your Optimal Path
                  </h2>
                  {decision && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="h-9 gap-1.5 font-medium"
                      >
                        {isExporting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        {isExporting ? "Generating PDF..." : "Export PDF"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="h-9 gap-1.5 font-medium"
                      >
                        {hasCopied ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {hasCopied ? "Copied!" : "Copy Summary"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-9 gap-1.5 font-medium text-muted-foreground hover:text-foreground"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                      </Button>
                    </div>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-center font-medium shadow-sm backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <div id="pdf-export-container" className="space-y-8 pb-4">
                  {/* Decision Skeleton */}
                  {isLoading && !decision && (
                    <div className="w-full relative group rounded-xl">
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-muted to-muted/50 rounded-xl opacity-20 blur-sm animate-pulse"></div>
                      <Card className="relative border-border/50 bg-card/80 backdrop-blur-xl shadow-xl overflow-hidden">
                        <div className="bg-primary/5 border-b border-border/50 p-6 md:p-8 space-y-4">
                          <div className="h-4 w-32 bg-muted/60 rounded-md animate-pulse"></div>
                          <div className="h-8 w-3/4 bg-muted/80 rounded-md animate-pulse"></div>
                          <div className="h-8 w-1/2 bg-muted/80 rounded-md animate-pulse"></div>
                        </div>
                        <CardContent className="p-6 md:p-8 space-y-8">
                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <div className="h-6 w-40 bg-muted/60 rounded-md animate-pulse"></div>
                              <div className="space-y-2">
                                <div className="h-4 w-full bg-muted/40 rounded-md animate-pulse delay-75"></div>
                                <div className="h-4 w-full bg-muted/40 rounded-md animate-pulse delay-100"></div>
                                <div className="h-4 w-5/6 bg-muted/40 rounded-md animate-pulse delay-150"></div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="h-6 w-48 bg-muted/60 rounded-md animate-pulse"></div>
                              <div className="space-y-3">
                                <div className="h-10 w-full bg-muted/30 rounded-lg animate-pulse delay-75"></div>
                                <div className="h-10 w-full bg-muted/30 rounded-lg animate-pulse delay-100"></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Decision Result Card */}
                  {decision && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                      className="w-full relative group rounded-xl"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-teal-500/30 rounded-xl opacity-30 blur-md"></div>
                      <Card className="relative border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/50 p-6 md:p-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                          <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-3 flex items-center gap-2">
                            <Target className="w-3.5 h-3.5" />
                            Primary Recommendation
                          </h3>
                          <p className="text-2xl md:text-3xl font-bold leading-tight text-foreground">
                            {decision.primaryRecommendation}
                          </p>
                        </div>

                        <CardContent className="p-0">
                          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
                            <div className="p-6 md:p-8 space-y-4 bg-background/30">
                              <h4 className="font-bold text-lg flex items-center gap-2 text-foreground">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                Why It Fits
                              </h4>
                              <p className="text-muted-foreground leading-relaxed text-base">
                                {decision.whyItFits}
                              </p>
                            </div>

                            <div className="p-6 md:p-8 space-y-4 bg-background/30">
                              <h4 className="font-bold text-lg flex items-center gap-2 text-foreground">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Trade-offs Accepted
                              </h4>
                              <ul className="space-y-3">
                                {decision.tradeoffsAccepted.map(
                                  (tradeoff, index) => (
                                    <motion.li
                                      initial={{ opacity: 0, x: 10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.1 * index }}
                                      key={index}
                                      className="flex items-start gap-3 text-muted-foreground bg-card p-3 rounded-lg border border-border/40 shadow-sm"
                                    >
                                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500/80 shrink-0" />
                                      <span className="text-sm leading-snug">
                                        {tradeoff}
                                      </span>
                                    </motion.li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Resources Skeleton */}
                  {isFetchingResources && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 pt-4"
                    >
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        <h3 className="text-xl font-bold tracking-tight text-foreground animate-pulse">
                          Curating Live Resources...
                        </h3>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-40 bg-muted/30 rounded-xl border border-border/30 animate-pulse"
                          ></div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {resourceError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-center font-medium shadow-sm backdrop-blur-sm"
                    >
                      {resourceError}
                    </motion.div>
                  )}

                  {/* Resources Results Card */}
                  {resources && resources.length > 0 && !isFetchingResources && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-6 pt-6 border-t border-border/40"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                          <Network className="w-6 h-6 text-blue-500" />
                          Curated Live Resources
                        </h3>
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                          </span>
                          Powered by SkillPatch / DeepAPI
                        </p>
                      </div>

                      <motion.div
                        variants={{
                          show: { transition: { staggerChildren: 0.1 } },
                        }}
                        initial="hidden"
                        animate="show"
                        className="grid gap-4 md:grid-cols-2"
                      >
                        {resources.map((resource, index) => (
                          <motion.div
                            key={index}
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              show: {
                                opacity: 1,
                                y: 0,
                                transition: { type: "spring", bounce: 0.4 },
                              },
                            }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="h-full"
                          >
                            <Card className="flex flex-col h-full bg-card/80 backdrop-blur-sm border-border/50 hover:border-blue-500/40 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
                              <CardContent className="p-5 flex-grow space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-semibold leading-tight line-clamp-2 group-hover:text-blue-500 transition-colors">
                                    {resource.title}
                                  </h4>
                                  <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                  {resource.snippet}
                                </p>
                              </CardContent>
                              <div className="p-4 pt-0 mt-auto">
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex w-full items-center justify-center rounded-lg bg-secondary/50 border border-border/50 px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted hover:text-blue-500 transition-all group/link"
                                >
                                  Open Resource
                                  <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all" />
                                </a>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
