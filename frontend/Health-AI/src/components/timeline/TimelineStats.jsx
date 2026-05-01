import {
  Activity,
  AlertTriangle,
  FileText,
  Pill,
  ListChecks,
} from "lucide-react";

const statCards = [
  {
    key: "totalEvents",
    label: "Total Events",
    icon: Activity,
    tone: "border-primary/20 bg-primary/10 text-primary",
  },
  {
    key: "reports",
    label: "Reports",
    icon: FileText,
    tone: "border-purple-500/20 bg-purple-500/10 text-purple-300",
  },
  {
    key: "medicines",
    label: "Medicines",
    icon: Pill,
    tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
  {
    key: "routine",
    label: "Routine",
    icon: ListChecks,
    tone: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  },
  {
    key: "alerts",
    label: "Attention Points",
    icon: AlertTriangle,
    tone: "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",
  },
];

const TimelineStats = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className={`rounded-3xl border p-4 shadow-xl shadow-black/10 ${card.tone}`}
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <Icon size={20} />
            </div>

            <p className="text-2xl font-bold text-white">
              {stats[card.key] ?? 0}
            </p>
            <p className="mt-1 text-xs font-medium opacity-80">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineStats;