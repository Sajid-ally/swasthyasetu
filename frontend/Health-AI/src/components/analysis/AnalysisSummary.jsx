const AnalysisSummary = ({ summary }) => {
  return (
    <div className="rounded-card border border-primary/20 bg-primary/10 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">{summary.title}</h3>
      <p className="text-sm leading-7 text-slate-300">{summary.text}</p>
    </div>
  );
};

export default AnalysisSummary;