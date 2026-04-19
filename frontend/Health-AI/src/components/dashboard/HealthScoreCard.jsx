import { HeartPulse } from "lucide-react";
import SectionCard from "../common/SectionCard";

const HealthScoreCard = ({ data }) => {
  const score = data?.value ?? 0;
  const status = data?.status ?? "Unknown";
  const message = data?.message ?? "No health summary available.";

  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(score, 100));
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <SectionCard title="Health Score" icon={HeartPulse}>
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="-rotate-90 h-full w-full">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#243041"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#06b6d4"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{score}</span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent animate-pulseSoft">
              {status}
            </span>
          </div>
        </div>

        <p className="mt-5 max-w-xs text-center text-sm leading-6 text-muted">
          {message}
        </p>
      </div>
    </SectionCard>
  );
};

export default HealthScoreCard;