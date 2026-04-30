"use client";

import { useState, useEffect } from "react";

type StepData = {
  users: number;
  conversion: number;
  dropOff: number;
  trend: number;
};

export default function Home() {
  const baseDataset: Record<string, StepData> = {
    Landing: { users: 12432, conversion: 0.62, dropOff: 0.38, trend: -0.08 },
    Signup: { users: 7632, conversion: 0.42, dropOff: 0.58, trend: -0.12 },
    Onboarding: { users: 3200, conversion: 0.28, dropOff: 0.72, trend: -0.05 },
    Activation: { users: 1400, conversion: 0.18, dropOff: 0.82, trend: -0.02 },
  };

  const [dataset, setDataset] = useState(baseDataset);
  const [history, setHistory] = useState<string[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const steps = Object.keys(dataset);

  const worstStep = steps.reduce((worst, current) =>
    dataset[current].dropOff > dataset[worst].dropOff ? current : worst
  );

  const [selectedStep, setSelectedStep] = useState<string>(worstStep);

  // 🔥 Load memory from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("history");
    const savedInsights = localStorage.getItem("insights");

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedInsights) setInsights(JSON.parse(savedInsights));
  }, []);

  // 🔥 Persist memory
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("insights", JSON.stringify(insights));
  }, [history, insights]);

  const funnel = steps.map((step, i) => ({
    label: step,
    value: i === 0 ? 100 : Math.round(dataset[step].conversion * 100),
  }));

  const calculateImpact = (step: string) => {
    const d = dataset[step];
    return Math.round(d.users * (d.dropOff * 0.2));
  };

  function analyze(step: string) {
    const d = dataset[step];
    const drop = Math.round(d.dropOff * 100);
    const impact = calculateImpact(step);
    const isWorst = step === worstStep;

    const visitedBefore = history.includes(step);
    const repeatCount = history.filter((s) => s === step).length;

    let memoryContext = "";

    if (visitedBefore) {
      memoryContext += `You've explored ${step} before. `;
    }

    if (repeatCount > 1) {
      memoryContext += `Repeated focus suggests this is a priority area. `;
    }

    if (insights.length > 0) {
      memoryContext += `You've already tested improvements in this funnel. `;
    }

    return {
      summary: isWorst
        ? `${step} is still the primary failure point.`
        : `${step} contributes to overall friction.`,

      detail: `${drop}% of users drop off here.`,

      reasoning: `${memoryContext}${
        isWorst
          ? `Users reach this stage but fail to continue, indicating post-intent friction.`
          : `This step introduces incremental drop-off that compounds downstream.`
      }`,

      recommendation: isWorst
        ? `Fix this step first for maximum impact.`
        : `Optimize after addressing higher-impact steps.`,

      impact,
      confidence: isWorst ? "High" : "Medium",
    };
  }

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAnalysis(analyze(selectedStep));
      setLoading(false);
    }, 400);
  }, [selectedStep, dataset, history, insights]);

  const simulateFix = () => {
    const updated = { ...dataset };

    updated[selectedStep] = {
      ...updated[selectedStep],
      dropOff: Math.max(0, updated[selectedStep].dropOff - 0.15),
    };

    setDataset(updated);

    setInsights((prev) => [
      ...prev,
      `Improved ${selectedStep} (simulated)`,
    ]);
  };

  const resetSession = () => {
    setHistory([]);
    setInsights([]);
    setDataset(baseDataset);
    localStorage.clear();
  };

  const styles: any = {
    page: {
      display: "flex",
      height: "100vh",
      background: "#f6f7f9",
      fontFamily: "Inter, sans-serif",
    },
    left: { flex: 1, padding: 32 },
    right: {
      width: 360,
      background: "#fff",
      borderLeft: "1px solid #e5e7eb",
    },
    panel: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: 16,
    },
    row: { marginBottom: 12, cursor: "pointer" },
  };

  return (
    <div style={styles.page}>
      {/* LEFT */}
      <div style={styles.left}>
        <h3>Funnel Analysis</h3>

        <div style={styles.panel}>
          {funnel.map((step) => {
            const isWorst = step.label === worstStep;

            return (
              <div
                key={step.label}
                style={{
                  ...styles.row,
                  padding: 8,
                  borderRadius: 6,
                  background: isWorst ? "#fef2f2" : "transparent",
                }}
                onClick={() => {
                  setSelectedStep(step.label);
                  setHistory((prev) => [...prev, step.label]);
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{step.label}</span>
                  <span>{step.value}%</span>
                </div>

                <div style={{ background: "#e5e7eb", marginTop: 4 }}>
                  <div
                    style={{
                      width: `${step.value}%`,
                      height: 8,
                      borderRadius: 999,
                      background: isWorst ? "#dc2626" : "#6366f1",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.right}>
        <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb" }}>
          ✨ UX Visor <span style={{ fontSize: 10, color: "#6366f1" }}>BETA</span>
        </div>

        <div style={{ padding: 16 }}>
          {loading ? (
            <div>Analyzing...</div>
          ) : (
            <>
              <div style={{ fontWeight: 600 }}>{analysis.summary}</div>

              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {analysis.detail}
              </div>

              <div style={{ marginTop: 10 }}>
                <strong>Why:</strong> {analysis.reasoning}
              </div>

              <div>
                <strong>Action:</strong> {analysis.recommendation}
              </div>

              <div>
                <strong>Impact:</strong> +{analysis.impact.toLocaleString()} users
              </div>

              <div style={{ fontSize: 11, color: "#6b7280" }}>
                Confidence: {analysis.confidence}
              </div>

              <button
                onClick={simulateFix}
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                Simulate Fix
              </button>

              <button
                onClick={resetSession}
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #eee",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Reset Session
              </button>

              {history.length > 0 && (
                <div style={{ marginTop: 12, fontSize: 11, color: "#6b7280" }}>
                  <strong>Session Memory:</strong>
                  <div>{history.join(" → ")}</div>
                </div>
              )}

              {insights.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 11, color: "#6b7280" }}>
                  <strong>Changes Tested:</strong>
                  <ul>
                    {insights.map((i, idx) => (
                      <li key={idx}>{i}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}