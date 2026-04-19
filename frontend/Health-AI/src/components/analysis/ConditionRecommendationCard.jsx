const ConditionRecommendationCard = ({ data }) => {
  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">{data.title}</h3>
      <p className="text-sm leading-7 text-muted">{data.description}</p>
    </div>
  );
};

export default ConditionRecommendationCard;