import { Scale, Ruler, Weight, HeartPulse } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";

const getBMIData = (heightValue, weightValue) => {
  const height = parseFloat(String(heightValue || "").replace(/[^\d.]/g, ""));
  const weight = parseFloat(String(weightValue || "").replace(/[^\d.]/g, ""));

  if (!height || !weight) {
    return {
      bmi: "--",
      category: "Not Available",
      variant: "default",
      progress: 0,
    };
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const roundedBMI = bmi.toFixed(1);

  if (bmi < 18.5) {
    return {
      bmi: roundedBMI,
      category: "Underweight",
      variant: "warning",
      progress: 25,
    };
  }

  if (bmi < 25) {
    return {
      bmi: roundedBMI,
      category: "Normal",
      variant: "success",
      progress: 55,
    };
  }

  if (bmi < 30) {
    return {
      bmi: roundedBMI,
      category: "Overweight",
      variant: "warning",
      progress: 78,
    };
  }

  return {
    bmi: roundedBMI,
    category: "Obese",
    variant: "danger",
    progress: 100,
  };
};

const BMIDisplay = ({ profile = {} }) => {

  // ✅ FIX 1: fallback support
  const height = profile.height_cm || profile.height;
  const weight = profile.weight_kg || profile.weight;

  const bmiValue = profile.bmi;

  // ✅ FIX 2: missing semicolon fixed
  const bmiData = bmiValue
    ? {
        bmi: bmiValue,
        ...(bmiValue < 18.5
          ? { category: "Underweight", variant: "warning", progress: 25 }
          : bmiValue < 25
          ? { category: "Normal", variant: "success", progress: 55 }
          : bmiValue < 30
          ? { category: "Overweight", variant: "warning", progress: 78 }
          : { category: "Obese", variant: "danger", progress: 100 }),
      }
    : getBMIData(height, weight); // ✅ FIXED

  return (
    <SectionCard
      title="BMI Overview"
      subtitle="Body Mass Index based on your current height and weight"
      icon={Scale}
    >
      <div className="space-y-5">

        {/* BMI CARD */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Current BMI</p>
              <h3 className="mt-2 text-4xl font-bold tracking-tight text-white">
                {bmiData.bmi}
              </h3>
            </div>

            <InfoBadge
              label={bmiData.category}
              variant={bmiData.variant}
            />
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${bmiData.progress}%` }}
            />
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-400">
            Healthy BMI range is generally between 18.5 and 24.9.
          </p>
        </div>

        {/* HEIGHT & WEIGHT */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Ruler size={16} />
              <span className="text-sm">Height</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {height ? `${height} cm` : "Not available"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-400">
              <Weight size={16} />
              <span className="text-sm">Weight</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {weight ? `${weight} kg` : "Not available"}
            </p>
          </div>
        </div>

        {/* INSIGHT */}
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <HeartPulse size={16} />
            <span className="text-sm font-medium">Health Insight</span>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            BMI is a useful screening metric, but it should be interpreted along
            with lifestyle, medical history, and other health indicators.
          </p>
        </div>

      </div>
    </SectionCard>
  );
};

export default BMIDisplay;