"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const dataset: any = {
    Landing: { users: 12432, conversion: 0.62, dropOff: 0.38, trend: -0.08 },
    Signup: { users: 7632, conversion: 0.42, dropOff: 0.58, trend: -0.12 },
    Onboarding: { users: 3200, conversion: 0.28, dropOff: 0.72, trend: -0.05 },
    Activation: { users: 1400, conversion: 0.18, dropOff: 0.82, trend: -0.02 },
  };

  const steps = Object.keys(dataset);

  const worstStep = Object.entries(dataset).reduce((worst, current) =>
    current[1].dropOff > worst[1].dropOff ? current : worst
  )[0];

  const [selectedStep, setSelectedStep] = useState(worstStep);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const funnel = steps.map((step, i) => ({
    label: step,
    value: i === 0 ? 100 : Math.round(dataset[step].conversion * 100),
  }));

  const current = dataset[selectedStep];

  const metrics = {
    Visitors: current.users.toLocaleString(),
    Signups: Math.round(current.users * 0.62).toLocaleString(),
    Onboarding: Math.round(current.users * 0.28).toLocaleString(),
    Activation: Math.round(current.users * 0.12).toLocaleString(),
  };

  const calculateImpact = (step: string) => {
    const d = dataset[step];
    return Math.round(d.users * (d.dropOff * 0.2));
  };

  const analyze = (step: string) => {
    const d = dataset[step];
    const drop = Math.round(d.dropOff * 100);
    const impact = calculateImpact(step);
    const isWorst = step === worstStep;

    return {
      summary: isWorst
        ? `${step} is the largest drop-off point. Fixing it could recover ~${impact.toLocaleString()} users.`
        : `${step} shows moderate friction in the funnel.`,
      detail: `${drop}% of users drop off at this step.`,
      impact,
      next: "Reduce friction and accelerate time-to-value.",
    };
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setAnalysis(analyze(selectedStep));
      setLoading(false);
    }, 500);
  }, [selectedStep]);

  const styles: any = {
    page: {
      display: "flex",
      height: "100vh",
      background: "#f6f7f9",
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#111",
    },
    container: { flex: 1, padding: 32 },
    content: { maxWidth: 960, margin: "0 auto" },
    title: { fontSize: 18, fontWeight: 600, marginBottom: 4 },
    subtitle: { fontSize: 12, color: "#6b7280", marginBottom: 24 },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12,
      marginBottom: 24,
    },

    card: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      padding: 14,
      transition: "all 0.2s ease",
    },

    panel: {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 16,
    },

    funnelRow: {
      marginBottom: 14,
      padding: 8,
      borderRadius: 8,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },

    barBg: {
      height: 8,
      background: "#e5e7eb",
      borderRadius: 999,
      marginTop: 6,
    },

    right: {
      width: 380,
      borderLeft: "1px solid #e5e7eb",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
    },

    visorHeader: {
      padding: 16,
      borderBottom: "1px solid #e5e7eb",
      fontWeight: 600,
    },

    visorContent: {
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },

    skeleton: {
      height: 12,
      background: "#e5e7eb",
      borderRadius: 4,
      animation: "pulse 1.5s infinite",
    },
  };

  return (
    <div style={styles.page}>
      {/* LEFT */}
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.title}>Funnel Analysis</div>
          <div style={styles.subtitle}>Last 30 days</div>

          {/* Metrics */}
          <div style={styles.grid}>
            {Object.entries(metrics).map(([k, v]) => (
              <div
                key={k}
                style={styles.card}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div style={{ fontSize: 11, color: "#6b7280" }}>{k}</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Funnel */}
          <div style={styles.panel}>
            {funnel.map((step) => {
              const isActive = selectedStep === step.label;
              const isWorst = step.label === worstStep;

              return (
                <div
                  key={step.label}
                  onClick={() => setSelectedStep(step.label)}
                  style={{
                    ...styles.funnelRow,
                    background: isWorst
                      ? "#fef2f2"
                      : isActive
                      ? "#eef2ff"
                      : "transparent",
                    border: isWorst ? "1px solid #fecaca" : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.01)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span>{step.label}</span>
                    <span>{step.value}%</span>
                  </div>

                  {isWorst && (
                    <div style={{ fontSize: 11, color: "#dc2626" }}>
                      Biggest issue
                    </div>
                  )}

                  <div style={styles.barBg}>
                    <div
                      style={{
                        width: `${step.value}%`,
                        height: 8,
                        borderRadius: 999,
                        background: isWorst
                          ? "#dc2626"
                          : isActive
                          ? "#4f46e5"
                          : "#9ca3af",
                        transition: "all 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.right}>
        <div
          style={{
            ...styles.visorHeader,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>✨ UX Visor</span>

          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: 6,
              background: "#eef2ff",
              color: "#4f46e5",
              letterSpacing: "0.04em",
              opacity: 0.85,
            }}
          >
            BETA
          </span>
        </div>

        <div style={styles.visorContent}>
          {loading ? (
            <>
              <div style={styles.skeleton}></div>
              <div style={{ ...styles.skeleton, width: "80%" }}></div>
              <div style={{ ...styles.skeleton, width: "60%" }}></div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 500 }}>{analysis.summary}</div>

              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {analysis.detail}
              </div>

              <div>
                <strong>Impact:</strong> +{analysis.impact.toLocaleString()} users
              </div>

              <div>
                <strong>Next:</strong> {analysis.next}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}