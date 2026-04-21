const RecommendationCard = ({ recommendations }) => {
  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h3 className="mb-5 text-lg font-semibold text-white">Recommendations</h3>

      <ul className="space-y-3">
        {recommendations.map((item, index) => (
          <li
            key={index}
            className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted"
          >
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationCard;