import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Brain,
  HeartPulse,
  ClipboardList,
  BarChart3,
  Sparkles,
  TrendingUp,
  Moon,
  Footprints,
  Dumbbell,
  Stethoscope,
  FileText,
  CheckCircle2,
  Droplets,
  X,
  AlertTriangle,
  ShieldCheck,
  Pill,
  RefreshCcw,
} from "lucide-react";

import PageContainer from "../components/layout/PageContainer";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import { getAnalysisData } from "../services/analysisService";
import { useUser } from "../context/UserContext";

const getMetricIcon = (label = "") => {
  const text = label.toLowerCase();

  if (text.includes("sleep")) return Moon;
  if (text.includes("water")) return Droplets;
  if (text.includes("step")) return Footprints;
  if (text.includes("workout")) return Dumbbell;
  if (text.includes("blood") || text.includes("pressure")) return HeartPulse;
  if (text.includes("sugar")) return Pill;

  return Activity;
};

const getMetricProgress = (label = "", value = "") => {
  const text = label.toLowerCase();
  const raw = String(value);
  const num = parseInt(raw);

  if (text.includes("sleep")) {
    if (!num) return 0;
    return Math.min((num / 8) * 100, 100);
  }

  if (text.includes("water")) {
    if (!num) return 0;
    return Math.min((num / 4) * 100, 100);
  }

  if (text.includes("step")) {
    if (!num) return 0;
    return Math.min((num / 10000) * 100, 100);
  }

  if (text.includes("workout")) {
    if (!num) return 0;
    return Math.min((num / 120) * 100, 100);
  }

  if (text.includes("blood") || text.includes("pressure")) {
    return 75;
  }

  if (text.includes("sugar")) {
    return 70;
  }

  return 60;
};

const formatReportType = (value = "") => {
  return value.replaceAll("_", " ") || "Medical Report";
};

const formatDate = (value) => {
  if (!value) return "Date not available";

  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

const getFindingVariant = (status = "") => {
  const safe = status.toLowerCase();

  if (safe.includes("normal")) {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
  }

  if (
    safe.includes("attention") ||
    safe.includes("high") ||
    safe.includes("low")
  ) {
    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-200";
  }

  return "border-white/10 bg-white/[0.04] text-slate-300";
};

const DetailModal = ({ title, children, onClose }) => {
  if (!title) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#071127] p-6 shadow-2xl shadow-black/50">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-400">
              Detailed analysis information
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

const AnalysisPage = () => {
  const { userId, user } = useUser();

  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modal, setModal] = useState(null);

  const loadAnalysis = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError("");

      const data = await getAnalysisData(userId);

      if (!data) {
        setAnalysisData(null);
        setError("Failed to load analysis data.");
        return;
      }

      if (data?.error) {
        setAnalysisData(null);
        setError(data.error);
        return;
      }

      setAnalysisData(data);
    } catch (err) {
      console.error("Analysis fetch error:", err);
      setAnalysisData(null);
      setError("Failed to load analysis data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();

    const refreshHandler = () => loadAnalysis();

    window.addEventListener("smart-add-updated", refreshHandler);
    window.addEventListener("assistant-command-updated", refreshHandler);
    window.addEventListener("timeline-updated", refreshHandler);

    return () => {
      window.removeEventListener("smart-add-updated", refreshHandler);
      window.removeEventListener("assistant-command-updated", refreshHandler);
      window.removeEventListener("timeline-updated", refreshHandler);
    };
  }, [userId]);

  const metrics = analysisData?.metrics || [];
  const recommendations = analysisData?.recommendations || [];
  const issues = analysisData?.issues || [];
  const score = analysisData?.score || null;
  const summary = analysisData?.summary || null;
  const condition = analysisData?.condition || null;
  const reports = analysisData?.reports || [];
  const reportInsights = analysisData?.report_insights || {};

  const primaryCondition = condition?.description
    ? condition.description.split(",")[0].trim()
    : "No major issue";

  const attentionPoints = reportInsights?.attention_points || [];
  const abnormalFindings = reportInsights?.abnormal_findings || [];

  const latestReport = useMemo(() => {
    return reports?.[0] || null;
  }, [reports]);

  return (
    <PageContainer>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_35%)]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
                <Sparkles size={16} />
                Smart Health Insights
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Analysis Dashboard
              </h1>

              <p className="mt-4 text-lg leading-8 text-slate-300">
                Personalized insights from routine, vitals, conditions, medicines,
                and saved medical report findings.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  Active user:{" "}
                  <span className="font-semibold text-white">
                    {user?.name || analysisData?.user?.name || userId}
                  </span>
                </div>

                <button
                  onClick={loadAnalysis}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
                >
                  <RefreshCcw size={16} />
                  Refresh Analysis
                </button>
              </div>
            </div>

            <div className="min-w-[260px] rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-emerald-400/10 p-4 text-emerald-300">
                  <BarChart3 size={28} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                    Status
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-emerald-300">
                    {analysisData ? "Analysis Loaded" : "Waiting"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    Based on logged-in user data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading && <Loader text="Loading analysis data..." />}

        {!loading && error && (
          <ErrorState title="Analysis Error" message={error} />
        )}

        {!loading && !error && !analysisData && (
          <EmptyState
            title="No analysis loaded"
            message="Login with a user profile to view health analysis."
          />
        )}

        {!loading && !error && analysisData && (
          <>
            <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="rounded-[2rem] border border-cyan-500/15 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <div className="mb-5 inline-flex rounded-2xl bg-cyan-500/10 p-4 text-cyan-300">
                  <TrendingUp size={24} />
                </div>
                <p className="text-sm text-slate-400">Overall Score</p>
                <h3 className="mt-2 text-5xl font-bold text-white">
                  {score?.value ?? "--"}
                </h3>
                <p className="mt-2 text-lg font-medium text-slate-300">
                  {score?.status || "Not available"}
                </p>
              </div>

              <div className="rounded-[2rem] border border-cyan-500/15 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <div className="mb-5 inline-flex rounded-2xl bg-cyan-500/10 p-4 text-cyan-300">
                  <HeartPulse size={24} />
                </div>
                <p className="text-sm text-slate-400">Health Focus</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {primaryCondition}
                </h3>
                <p className="mt-2 text-lg text-slate-400">Primary concern</p>
              </div>

              <div className="rounded-[2rem] border border-cyan-500/15 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <div className="mb-5 inline-flex rounded-2xl bg-cyan-500/10 p-4 text-cyan-300">
                  <Brain size={24} />
                </div>
                <p className="text-sm text-slate-400">Issues Found</p>
                <h3 className="mt-2 text-5xl font-bold text-white">
                  {issues.length}
                </h3>
                <p className="mt-2 text-lg text-slate-400">
                  Detected from analysis
                </p>
              </div>

              <div className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-purple-950/60 to-slate-950 p-6">
                <div className="mb-5 inline-flex rounded-2xl bg-purple-500/10 p-4 text-purple-300">
                  <FileText size={24} />
                </div>
                <p className="text-sm text-slate-400">Saved Reports</p>
                <h3 className="mt-2 text-5xl font-bold text-white">
                  {reports.length}
                </h3>
                <p className="mt-2 text-lg text-slate-400">
                  From timeline records
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 xl:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                      Performance
                    </div>
                    <h2 className="text-4xl font-bold text-white">
                      Metrics Breakdown
                    </h2>
                    <p className="mt-2 text-slate-400">
                      Backend-driven health metrics for the logged-in user.
                    </p>
                  </div>

                  <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-lg font-semibold text-cyan-300">
                    Score: {score?.value ?? "--"}
                  </div>
                </div>

                <div className="space-y-5">
                  {metrics.map((item, index) => {
                    const Icon = getMetricIcon(item.label);
                    const progress = getMetricProgress(item.label, item.value);

                    return (
                      <div
                        key={index}
                        className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                              <Icon size={22} />
                            </div>
                            <div>
                              <h3 className="text-2xl font-semibold text-white">
                                {item.label}
                              </h3>
                              <p className="text-sm text-slate-400">
                                Current recorded value
                              </p>
                            </div>
                          </div>

                          <span className="text-3xl font-bold text-cyan-300">
                            {item.value}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
                <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  AI Score
                </div>

                <h2 className="text-2xl font-bold text-white">
                  Overall Health Score
                </h2>

                <p className="mt-2 text-slate-400">
                  {score?.note || "Calculated from backend data"}
                </p>

                <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Score Value</p>
                  <h3 className="mt-2 text-6xl font-bold text-cyan-300">
                    {score?.value ?? "--"}
                  </h3>
                  <p className="mt-1 text-xl font-semibold text-white">
                    {score?.status || "Unknown"}
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {issues.length > 0 ? (
                    issues.map((issue, index) => (
                      <div
                        key={index}
                        className="rounded-[1.25rem] border border-yellow-500/20 bg-yellow-500/10 p-4"
                      >
                        <p className="text-sm font-semibold text-yellow-300">
                          Issue {index + 1}
                        </p>
                        <p className="mt-2 text-slate-200">{issue}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300">
                      No critical issues found.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 xl:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="mb-2 inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
                      Reports
                    </div>
                    <h2 className="text-4xl font-bold text-white">
                      Report-Based Insights
                    </h2>
                    <p className="mt-2 text-slate-400">
                      Medical report summaries and extracted findings from saved
                      timeline records.
                    </p>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-300">
                    {reports.length} Reports
                  </div>
                </div>

                <div className="space-y-4">
                  {reports.length === 0 ? (
                    <EmptyState
                      title="No saved reports found"
                      message="Upload and save a report from the AI assistant to see report-based insights here."
                    />
                  ) : (
                    reports.slice(0, 4).map((report, index) => (
                      <div
                        key={report.id || index}
                        className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="rounded-2xl bg-purple-500/10 p-4 text-purple-300">
                              <FileText size={24} />
                            </div>

                            <div>
                              <h3 className="text-2xl font-semibold capitalize text-white">
                                {formatReportType(report.report_type)}
                              </h3>
                              <p className="mt-2 leading-6 text-slate-400">
                                {report.summary || "No summary available."}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                <span>{formatDate(report.created_at)}</span>
                                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-purple-300">
                                  {report.source || "report_ai"}
                                </span>
                                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-300">
                                  {report.possible_attention_points?.length || 0} attention
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              setModal({
                                type: "report",
                                title: formatReportType(report.report_type),
                                data: report,
                              })
                            }
                            className="rounded-2xl border border-purple-400/20 bg-purple-500/10 px-5 py-3 font-medium text-purple-300 transition hover:bg-purple-500/20"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
                <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Care Plan
                </div>

                <h2 className="text-2xl font-bold text-white">
                  Recommendations
                </h2>

                <p className="mt-2 text-slate-400">
                  Suggested actions generated from analysis engine.
                </p>

                <div className="mt-6 space-y-4">
                  {recommendations.length > 0 ? (
                    recommendations.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-4"
                      >
                        <CheckCircle2
                          size={18}
                          className="mt-1 shrink-0 text-emerald-300"
                        />
                        <p className="text-slate-200">{item}</p>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No recommendations"
                      message="No care suggestions available."
                    />
                  )}
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-blue-400/20 bg-blue-500/10 p-5">
                  <div className="mb-2 flex items-center gap-2 text-blue-300">
                    <Stethoscope size={18} />
                    <span className="font-semibold">Wellness Protection</span>
                  </div>
                  <p className="text-sm leading-7 text-slate-300">
                    These insights are for awareness only and are not a medical
                    diagnosis.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-2 inline-flex rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-yellow-300">
                    Report Attention
                  </div>
                  <h2 className="text-4xl font-bold text-white">
                    Attention Points From Reports
                  </h2>
                  <p className="mt-2 text-slate-400">
                    Extracted from medical report key findings.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setModal({
                      type: "attention",
                      title: "All Attention Findings",
                      data: abnormalFindings,
                    })
                  }
                  className="rounded-2xl border border-yellow-400/20 bg-yellow-500/10 px-5 py-3 font-medium text-yellow-300 transition hover:bg-yellow-500/20"
                >
                  View All
                </button>
              </div>

              {attentionPoints.length === 0 ? (
                <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/10 p-5 text-emerald-200">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={22} />
                    <span>No report attention points detected.</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {attentionPoints.map((point, index) => (
                    <span
                      key={`${point}-${index}`}
                      className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-200"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-6">
              <div className="mb-6">
                <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Timeline
                </div>
                <h2 className="text-4xl font-bold text-white">
                  Metrics Timeline View
                </h2>
                <p className="mt-2 text-slate-400">
                  Backend-driven breakdown of latest health metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {metrics.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-semibold text-cyan-300">
                      M{index + 1}
                    </h3>
                    <p className="mt-3 text-lg text-white">{item.label}</p>
                    <p className="mt-2 text-slate-400">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {modal?.type === "report" && (
        <DetailModal
          title={modal.title}
          onClose={() => setModal(null)}
        >
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-semibold text-slate-400">Summary</p>
              <p className="mt-2 leading-7 text-white">
                {modal.data.summary || "No summary available."}
              </p>
            </div>

            {modal.data.possible_attention_points?.length ? (
              <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                <p className="mb-3 flex items-center gap-2 text-sm font-bold text-yellow-200">
                  <AlertTriangle size={16} />
                  Attention Points
                </p>

                <div className="flex flex-wrap gap-2">
                  {modal.data.possible_attention_points.map((point, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-100"
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2">
              {(modal.data.key_findings || []).map((finding, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border p-4 ${getFindingVariant(
                    finding.status
                  )}`}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="font-bold text-white">
                      {finding.name || "Finding"}
                    </p>
                    <span className="rounded-full bg-black/20 px-2 py-1 text-[10px] uppercase">
                      {finding.status || "unknown"}
                    </span>
                  </div>

                  <p className="text-lg font-bold">
                    {finding.value || "--"} {finding.unit || ""}
                  </p>

                  {finding.note ? (
                    <p className="mt-2 text-xs leading-5 opacity-80">
                      {finding.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-xs leading-6 text-yellow-100">
              {modal.data.disclaimer ||
                "This is not a diagnosis. Please consult a qualified doctor."}
            </p>
          </div>
        </DetailModal>
      )}

      {modal?.type === "attention" && (
        <DetailModal
          title={modal.title}
          onClose={() => setModal(null)}
        >
          {modal.data?.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {modal.data.map((finding, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border p-4 ${getFindingVariant(
                    finding.status
                  )}`}
                >
                  <p className="font-bold text-white">{finding.name}</p>
                  <p className="mt-2 text-lg font-bold">
                    {finding.value} {finding.unit}
                  </p>
                  <p className="mt-2 text-xs opacity-80">
                    {finding.note || "No note available."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No attention findings"
              message="No abnormal report findings were detected."
            />
          )}
        </DetailModal>
      )}
    </PageContainer>
  );
};

export default AnalysisPage;