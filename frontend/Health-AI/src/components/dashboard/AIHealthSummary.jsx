import {
  Sparkles,
  Brain,
  ShieldCheck,
  TriangleAlert,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";
import ActionButton from "../common/ActionButton";

const priorityConfig = {
  low: {
    label: "Low Priority",
    variant: "success",
    ring: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  },
  medium: {
    label: "Medium Priority",
    variant: "warning",
    ring: "border-yellow-500/20 bg-yellow-500/10 text-yellow-200",
  },
  high: {
    label: "High Priority",
    variant: "danger",
    ring: "border-red-500/20 bg-red-500/10 text-red-200",
  },
};

const suggestionIconMap = {
  insight: Brain,
  recommendation: Lightbulb,
  alert: TriangleAlert,
  safe: ShieldCheck,
};

const AIHealthSummary = ({ summary = {} }) => {
  const {
    headline = "AI summary is not available yet.",
    overview = "No overview data available.",
    priority = "low",
    suggestions = [],
  } = summary;

  const currentPriority = priorityConfig[priority] || priorityConfig.low;

  return (
    <SectionCard
      title="AI Health Summary"
      subtitle="Generated insights based on your latest health activity"
      icon={Sparkles}
      action={
        <ActionButton variant="secondary" size="sm">
          View Details
        </ActionButton>
      }
    >
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-white/[0.04] to-cyan-500/10 p-5 shadow-2xl shadow-black/20">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative mb-4 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary">
                <Sparkles size={20} />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{headline}</h4>
                <p className="mt-1 text-xs text-slate-400">
                  AI-generated health overview
                </p>
              </div>
            </div>

            <InfoBadge
              label={currentPriority.label}
              variant={currentPriority.variant}
            />
          </div>

          <p className="relative text-sm leading-6 text-slate-300">
            {overview}
          </p>

          <div className={`relative mt-4 rounded-2xl border px-4 py-3 text-xs ${currentPriority.ring}`}>
            This summary is for awareness only. It is not a medical diagnosis.
          </div>
        </div>

        {suggestions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Brain size={22} />
            </div>
            <p className="text-sm font-semibold text-white">
              No AI recommendations yet
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Add routine, medicine, report or vital data to generate insights.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {suggestions.map((item, index) => {
              const SuggestionIcon =
                suggestionIconMap[item.type] || suggestionIconMap.insight;

              return (
                <div
                  key={item.id || index}
                  className="group flex items-start gap-4 rounded-3xl border border-white/10 bg-[#020617]/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.06]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-primary/15 text-primary">
                    <SuggestionIcon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h5 className="text-sm font-bold text-white">
                        {item.title || "Insight"}
                      </h5>

                      {item.tag && (
                        <InfoBadge
                          label={item.tag}
                          variant={item.tagVariant || "default"}
                        />
                      )}
                    </div>

                    <p className="text-sm leading-6 text-slate-400">
                      {item.description || "No description available."}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                      Review insight
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default AIHealthSummary;