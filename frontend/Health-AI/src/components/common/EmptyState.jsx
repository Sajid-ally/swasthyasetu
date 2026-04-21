const EmptyState = ({ title = "No data available", message = "Nothing to show right now." }) => {
  return (
    <div className="rounded-card border border-border bg-surface p-6 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
    </div>
  );
};

export default EmptyState;