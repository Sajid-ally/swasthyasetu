const ActionButton = ({
  children,
  variant = "primary",
  type = "button",
  onClick,   // ✅ ADD THIS
}) => {
  const styles = {
    primary:
      "bg-primary text-white hover:scale-[1.02] hover:opacity-90",
    secondary:
      "border border-border bg-background text-white hover:bg-surfaceLight",
    danger:
      "bg-red-500/15 text-red-300 border border-red-500/20 hover:bg-red-500/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}   // ✅ ADD THIS
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

export default ActionButton;