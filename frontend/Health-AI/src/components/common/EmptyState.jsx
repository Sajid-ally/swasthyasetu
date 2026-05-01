import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "No data available",
  message = "Nothing to show right now.",
}) => {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl shadow-black/20">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-slate-300">
        <Inbox size={22} />
      </div>

      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;