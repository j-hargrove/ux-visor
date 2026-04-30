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
  const steps = Object.keys(dataset);

  const worstStep = steps.reduce((worst, current) =>
    dataset[current].dropOff > dataset[worst].dropOff ? current : worst
  );

  const [selectedStep, setSelectedStep] = useState<string>(worstStep);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const funnel = steps.map((step, i) => ({
    label: step,
    value: i === 0 ? 100 : Math.round(dataset[step].conversion * 100),
  }));

  const current = dataset[selectedStep];

  const calculateImpact = (step: string) => {
    const d = dataset[step];
    return Math.round(d.users * (d.dropOff * 0.2));
  };

  function analyze(step: string) {
    const d = dataset[step];
    const drop = Math.round(d.dropOff * 100);
    const trend = Math.round(d.trend * 100);
    const impact = calculateImpact(step);
    const isWorst = step === worstStep;

    const context: Record<string, string> = {
      Landing: "expectation setting",
      Signup: "commitment moment",
      Onboarding: "first-time experience",
      Activation: "value realization",
    };

    const causes = [
      "unclear value proposition",
      "too many required steps",
      "cognitive overload",
      "slow perceived performance",
      "misaligned expectations",
    ];

    const cause = causes[Math.floor(Math.random() * causes.length)];

    return {
      summary: isWorst
        ? `${step} is the primary failure point.`
        : `${step} introduces moderate friction.`,
      detail: `${drop}% of users drop off here ${
        trend < 0 ? `(↓ ${Math.abs(trend)}% vs last period)` : ""
      }`,
      reasoning: isWorst
        ? `Users already showed intent before reaching ${step}, so this likely stems from ${cause} during ${context[step]}.`
        : `This suggests localized friction, not systemic failure.`,
      recommendation: isWorst
        ? `Simplify this step and reduce time-to-value.`
        : `Optimize after higher-impact steps.`,
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
  }, [selectedStep, dataset]);

  const simulateFix = () => {
    const updated = { ...dataset };
    updated[selectedStep] = {
      ...updated[selectedStep],
      dropOff: Math.max(0, updated[selectedStep].dropOff - 0.15),
    };
    setDataset(updated);
  };

  const styles: any = {
    page: { display: "flex", height: "100vh", fontFamily: "Inter, sans-serif", background: "#f6f7f9" },
    left: { flex: 1, padding: 32 },
    right: { width: 360, background: "#fff", borderLeft: "1px solid #e5e7eb" },
    panel: { background: "#fff", padding: 16, borderRadius: 10, border: "1px solid #e5e7eb" },
    row: { marginBottom: 12, cursor: "pointer" },
    bar: { height: 8, borderRadius: 999 },
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
                  background: isWorst ? "#fef2f2" : "transparent",
                  padding: 8,
                  borderRadius: 6,
                }}
                onClick={() => setSelectedStep(step.label)}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{step.label}</span>
                  <span>{step.value}%</span>
                </div>

                <div style={{ background: "#e5e7eb", marginTop: 4 }}>
                  <div
                    style={{
                      ...styles.bar,
                      width: `${step.value}%`,
                      background: isWorst ? "#dc2626" : "#6366f1",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
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
              <div style={{ fontSize: 12, color: "#6b7280" }}>{analysis.detail}</div>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}