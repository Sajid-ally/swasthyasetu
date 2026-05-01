import { AlertTriangle } from "lucide-react";

const ErrorState = ({
  title = "Something went wrong",
  message = "Please try again later.",
}) => {
  return (
    <div className="rounded-[1.75rem] border border-red-500/20 bg-red-500/10 p-8 text-center shadow-2xl shadow-black/20">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
        <AlertTriangle size={22} />
      </div>

      <h3 className="text-lg font-bold text-red-200">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-300">
        {message}
      </p>
    </div>
  );
};

export default ErrorState;