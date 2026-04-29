"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function CopilotPanel({
  selectedStep,
}: {
  selectedStep: string;
}) {
  const [data, setData] = useState<any>(null);

  // 🔥 Rich dataset (this is the brain)
  const dataset: any = {
    Landing: { users: 12432, dropOff: 0.38, trend: -0.08 },
    Signup: { users: 7632, dropOff: 0.58, trend: -0.12 },
    Onboarding: { users: 3200, dropOff: 0.72, trend: -0.05 },
    Activation: { users: 1400, dropOff: 0.82, trend: -0.02 },
  };

  const steps = Object.keys(dataset);

  // 🔥 Reasoning engine
  const analyze = (step: string) => {
    const current = dataset[step];

    const stepIndex = steps.indexOf(step);
    const prevStep = steps[stepIndex - 1];
    const prev = dataset[prevStep];

    const dropOffPct = Math.round(current.dropOff * 100);
    const trendPct = Math.round(current.trend * 100);

    // 🔥 Comparative reasoning
    let comparison = "";
    if (prev) {
      const ratio = (current.dropOff / prev.dropOff).toFixed(1);
      comparison = `${step} drop-off (${dropOffPct}%) is ${ratio}× higher than ${prevStep}.`;
    }

    // 🔥 Severity classification
    let severity = "low";
    if (current.dropOff > 0.7) severity = "high";
    else if (current.dropOff > 0.5) severity = "medium";

    // 🔥 Causal reasoning
    let cause = "";
    if (step === "Signup") {
      cause = "This typically indicates form friction or perceived effort outweighing user intent.";
    } else if (step === "Onboarding") {
      cause = "Users likely fail to reach core value quickly, indicating a weak or delayed 'aha moment'.";
    } else if (step === "Activation") {
      cause = "Users may not clearly understand what constitutes success within the product.";
    } else {
      cause = "Initial engagement may not align with acquisition intent.";
    }

    // 🔥 Summary (multi-layer reasoning)
    const summary = `${comparison} ${
      severity === "high"
        ? "This is a critical breakdown point in the funnel."
        : "This represents moderate friction in the user journey."
    } ${cause}`;

    // 🔥 Insight cards
    const issues = [
      `${dropOffPct}% of users drop off at ${step}, indicating significant friction.`,
      trendPct < 0
        ? `Performance is declining (${trendPct}%), suggesting recent regressions.`
        : `Performance is stable or improving.`,
    ];

    const improvements = [
      `Users who pass ${step} are significantly more likely to continue, indicating strong downstream value.`,
    ];

    const experiment =
      severity === "high"
        ? `Drastically reduce steps in ${step} and prioritize immediate value delivery.`
        : `Test incremental UX improvements in ${step}, focusing on clarity and speed.`;

    return {
      summary,
      issues,
      improvements,
      experiment,
    };
  };

  useEffect(() => {
    setData(analyze(selectedStep));
  }, [selectedStep]);

  if (!data) return null;

  return (
    <div className="space-y-4 text-gray-900 dark:text-gray-100">

      {/* Context */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Analyzing: <span className="font-medium">{selectedStep}</span>
      </div>

      {/* Summary */}
      <div className="rounded-xl border bg-gray-50 dark:bg-[#1a1d26] dark:border-white/10 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-purple-500" />
          <span className="text-xs text-gray-500">AI Summary</span>
        </div>
        <p className="text-sm">{data.summary}</p>
      </div>

      {/* Cards */}
      {[
        {
          icon: <ArrowDown className="text-red-500" />,
          title: "Drop-off insight",
          text: data.issues[0],
        },
        {
          icon: <AlertTriangle className="text-yellow-500" />,
          title: "Trend signal",
          text: data.issues[1],
        },
        {
          icon: <CheckCircle className="text-green-500" />,
          title: "Positive signal",
          text: data.improvements[0],
        },
        {
          icon: <Sparkles className="text-purple-500" />,
          title: "Recommended action",
          text: data.experiment,
        },
      ].map((card, i) => (
        <div
          key={i}
          className="rounded-xl border p-4 dark:border-white/10 hover:shadow-md transition"
        >
          <div className="flex gap-3">
            {card.icon}
            <div>
              <div className="text-sm font-medium">{card.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {card.text}
              </div>
            </div>
          </div>
        </div>
      ))}

    </div>
  );
}