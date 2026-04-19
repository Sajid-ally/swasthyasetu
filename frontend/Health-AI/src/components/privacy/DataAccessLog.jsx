import { Clock } from "lucide-react";
import SectionCard from "../common/SectionCard";

const DataAccessLog = ({ logs = [] }) => {
  return (
    <SectionCard
      title="Access Logs"
      subtitle="Recent activity on your health data"
      icon={Clock}
    >
      <div className="space-y-3">
        {logs.length === 0 ? (
          <div className="text-center text-sm text-slate-400">
            No activity recorded.
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <p className="text-sm text-white">{log.action}</p>
              <p className="text-xs text-slate-400">{log.time}</p>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
};

export default DataAccessLog;