const SectionCard = ({
  title,
  subtitle,
  children,
  rightContent,
  icon: Icon,
}) => {
  return (
    <div className="group animate-fadeUp rounded-card border border-border bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
      {(title || rightContent) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {Icon ? (
              <div className="rounded-xl bg-primary/15 p-2 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                <Icon size={18} />
              </div>
            ) : null}

            <div>
              {title && (
                <h3 className="text-lg font-semibold text-white">
                  {title}
                </h3>
              )}

              {subtitle && (
                <p className="mt-1 text-sm text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {rightContent}
        </div>
      )}

      {children}
    </div>
  );
};

export default SectionCard;