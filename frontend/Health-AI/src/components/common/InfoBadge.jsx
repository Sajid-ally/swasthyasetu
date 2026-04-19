const InfoBadge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-700 text-slate-200",
    high: "bg-red-500/15 text-red-300",
    medium: "bg-yellow-500/15 text-yellow-300",
    low: "bg-green-500/15 text-green-300",
    primary: "bg-primary/15 text-primaryLight",
    accent: "bg-accent/15 text-accent",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

export default InfoBadge;