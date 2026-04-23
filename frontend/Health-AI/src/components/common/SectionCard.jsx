const SectionCard = ({
  title,
  subtitle,      // ✅ ADD THIS
  children,
  rightContent,
  icon: Icon,
}) => {
  return (
    <div className="animate-fadeUp rounded-card border border-border bg-surface p-6 shadow-soft">
      
      {(title || rightContent) && (
        <div className="mb-5 flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">
            {Icon ? (
              <div className="rounded-xl bg-primary/15 p-2 text-primary">
                <Icon size={18} />
              </div>
            ) : null}

            <div>
              {title && (
                <h3 className="text-lg font-semibold text-white">
                  {title}
                </h3>
              )}

              {/* ✅ SUBTITLE SUPPORT */}
              {subtitle && (
                <p className="text-sm text-slate-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* ✅ BUTTON SHOWS HERE */}
          {rightContent}
        </div>
      )}

      {children}
    </div>
  );
};

export default SectionCard;