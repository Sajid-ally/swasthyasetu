const SectionCard = ({ title, children, rightContent, icon: Icon }) => {
  return (
    <div className="animate-fadeUp rounded-card border border-border bg-surface p-6 shadow-soft">
      {(title || rightContent) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon ? (
              <div className="rounded-xl bg-primary/15 p-2 text-primary">
                <Icon size={18} />
              </div>
            ) : null}
            {title ? <h3 className="text-lg font-semibold text-white">{title}</h3> : null}
          </div>

          {rightContent}
        </div>
      )}

      {children}
    </div>
  );
};

export default SectionCard;