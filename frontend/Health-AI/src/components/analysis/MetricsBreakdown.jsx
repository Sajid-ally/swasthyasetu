const MetricsBreakdown = ({ metrics }) => {
  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h3 className="mb-5 text-lg font-semibold text-white">Metrics Breakdown</h3>

      <div className="space-y-4">
        {metrics.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
          >
            <span className="text-sm font-medium text-white">{item.label}</span>
            <span className="text-sm text-primary">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsBreakdown;