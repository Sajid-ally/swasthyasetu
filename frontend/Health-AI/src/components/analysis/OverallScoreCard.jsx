const OverallScoreCard = ({ score }) => {
  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Overall Score</h3>

      <div className="space-y-2">
        <p className="text-5xl font-bold text-primary">{score.value}</p>
        <p className="text-sm font-medium text-white">{score.status}</p>
        <p className="text-sm text-muted">{score.note}</p>
      </div>
    </div>
  );
};

export default OverallScoreCard;