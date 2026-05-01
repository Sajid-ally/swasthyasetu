import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/20">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Loader2 size={22} className="animate-spin" />
      </div>

      <p className="text-sm font-medium text-slate-300">{text}</p>
    </div>
  );
};

export default Loader;