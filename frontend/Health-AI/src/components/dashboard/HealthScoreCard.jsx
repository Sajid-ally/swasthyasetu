import { useEffect, useMemo, useState } from "react";
import { HeartPulse } from "lucide-react";
import SectionCard from "../common/SectionCard";

const getScoreMeta = (score) => {
  if (score >= 80) {
    return {
      ring: "#06b6d4",
      glow: "rgba(6, 182, 212, 0.35)",
      badgeClass:
        "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",
    };
  }

  if (score >= 60) {
    return {
      ring: "#8b5cf6",
      glow: "rgba(139, 92, 246, 0.35)",
      badgeClass:
        "border-violet-400/20 bg-violet-500/10 text-violet-300",
    };
  }

  if (score >= 40) {
    return {
      ring: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.35)",
      badgeClass:
        "border-amber-400/20 bg-amber-500/10 text-amber-300",
    };
  }

  return {
    ring: "#ef4444",
    glow: "rgba(239, 68, 68, 0.35)",
    badgeClass:
      "border-red-400/20 bg-red-500/10 text-red-300",
  };
};

const HealthScoreCard = ({ data }) => {
  const score = Math.max(0, Math.min(Number(data?.value ?? 0), 100));
  const status = data?.status ?? "Unknown";
  const message = data?.message ?? "No health summary available.";

  const [animatedScore, setAnimatedScore] = useState(0);

  const radius = 68;
  const size = 180;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let frameId;

    const duration = 1400;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(score * easedProgress);

      setAnimatedScore(currentValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    setAnimatedScore(0);
    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [score]);

  const { ring, glow, badgeClass } = useMemo(
    () => getScoreMeta(score),
    [score]
  );

  const progressOffset =
    circumference - (animatedScore / 100) * circumference;

  const endAngle = (animatedScore / 100) * 360 - 90;
  const angleInRadians = (endAngle * Math.PI) / 180;
  const dotX = center + radius * Math.cos(angleInRadians);
  const dotY = center + radius * Math.sin(angleInRadians);

  return (
    <SectionCard title="Health Score" icon={HeartPulse}>
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="group relative flex h-[210px] w-[210px] items-center justify-center">
          {/* Soft glow */}
          <div
            className="absolute inset-8 rounded-full blur-2xl transition-all duration-500 group-hover:scale-110"
            style={{ backgroundColor: glow }}
          />

          {/* Decorative rotating ring */}
          <div className="absolute inset-5 rounded-full border border-white/5 animate-spinSlow" />

          <svg
            className="-rotate-90 relative z-10 h-[180px] w-[180px] drop-shadow-[0_0_20px_rgba(0,0,0,0.35)]"
            viewBox={`0 0 ${size} ${size}`}
          >
            <defs>
              <linearGradient id="healthScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={ring} stopOpacity="0.85" />
                <stop offset="100%" stopColor={ring} stopOpacity="1" />
              </linearGradient>
            </defs>

            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#243041"
              strokeWidth="12"
              fill="transparent"
            />

            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="url(#healthScoreGradient)"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              className="transition-all duration-300"
              style={{
                filter: `drop-shadow(0 0 10px ${glow})`,
              }}
            />

            {/* Endpoint glow dot */}
            {animatedScore > 0 && (
              <>
                <circle
                  cx={dotX}
                  cy={dotY}
                  r="7"
                  fill={ring}
                  opacity="0.25"
                />
                <circle
                  cx={dotX}
                  cy={dotY}
                  r="4.5"
                  fill={ring}
                />
              </>
            )}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold tracking-tight text-white">
              {animatedScore}
            </div>

            <div
              className={`mt-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${badgeClass}`}
            >
              {status}
            </div>
          </div>
        </div>

        <p className="mt-2 max-w-xs text-center text-sm leading-6 text-muted">
          {message}
        </p>
      </div>
    </SectionCard>
  );
};

export default HealthScoreCard;