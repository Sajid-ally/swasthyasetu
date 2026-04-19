const PrivacySettingsCard = ({ settings }) => {
  return (
    <div className="rounded-card border border-border bg-surface p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Privacy Settings</h3>

      <div className="space-y-4">
        {settings.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
          >
            <span className="text-sm text-white">{item.label}</span>
            <button
              className={`rounded-full px-4 py-1 text-xs font-medium ${
                item.enabled
                  ? "bg-green-500/20 text-green-300"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              {item.enabled ? "Enabled" : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacySettingsCard;