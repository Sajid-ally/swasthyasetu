const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="rounded-card border border-border bg-surface p-6 text-center">
      <p className="text-sm text-muted">{text}</p>
    </div>
  );
};

export default Loader;