import { useState } from "react";

const SmartAddButton = ({ onSubmit, isLoading = false }) => {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    await onSubmit(trimmed);
    setText("");
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit();
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-white">Smart Add</h3>
        <p className="text-sm text-slate-400">
          Add medication, symptom, routine, condition, or family history in plain text.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Example: I take paracetamol 500mg after dinner"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !text.trim()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Add with AI"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartAddButton;