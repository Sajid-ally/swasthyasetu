import { Sparkles, Brain, ShieldCheck, TriangleAlert, Lightbulb } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";
import ActionButton from "../common/ActionButton";

const priorityConfig = {
  low: {
    label: "Low Priority",
    variant: "success",
  },
  medium: {
    label: "Medium Priority",
    variant: "warning",
  },
  high: {
    label: "High Priority",
    variant: "danger",
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
        {/* Top summary box */}
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 shadow-soft">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary">
                <Sparkles size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{headline}</h4>
                <p className="text-xs text-slate-400">AI-generated summary</p>
              </div>
            </div>

            <InfoBadge
              label={currentPriority.label}
              variant={currentPriority.variant}
            />
          </div>

          <p className="text-sm leading-6 text-slate-300">{overview}</p>
        </div>

        {/* Suggestions list */}
        {suggestions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
            No AI recommendations available right now.
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((item, index) => {
              const SuggestionIcon =
                suggestionIconMap[item.type] || suggestionIconMap.insight;

              return (
                <div
                  key={item.id || index}
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-primary">
                    <SuggestionIcon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h5 className="text-sm font-semibold text-white">
                        {item.title}
                      </h5>

                      {item.tag && (
                        <InfoBadge
                          label={item.tag}
                          variant={item.tagVariant || "default"}
                        />
                      )}
                    </div>

                    <p className="text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
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