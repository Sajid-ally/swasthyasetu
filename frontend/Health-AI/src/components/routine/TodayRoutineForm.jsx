import { CheckCircle2, Circle, ClipboardList, Clock3 } from "lucide-react";
import SectionCard from "../common/SectionCard";
import InfoBadge from "../common/InfoBadge";
import ActionButton from "../common/ActionButton";

const TodayRoutineForm = ({ tasks = [] }) => {
  return (
    <SectionCard
      title="Today's Routine"
      subtitle="Track daily health tasks and progress"
      icon={ClipboardList}
      action={
        <ActionButton variant="secondary" size="sm">
          Update
        </ActionButton>
      }
    >
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
            No routine tasks available for today.
          </div>
        ) : (
          tasks.map((task, index) => {
            const completed = Boolean(task.completed);

            return (
              <div
                key={task.id || index}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/30 hover:bg-white/10"
              >
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 ${
                    completed
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-white/10 text-slate-400"
                  }`}
                >
                  {completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-semibold ${
                        completed ? "text-white" : "text-slate-200"
                      }`}
                    >
                      {task.title || "Untitled Task"}
                    </h4>

                    <InfoBadge
                      label={completed ? "Completed" : "Pending"}
                      variant={completed ? "success" : "warning"}
                    />
                  </div>

                  {task.description && (
                    <p className="text-sm leading-6 text-slate-400">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {task.time && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
                        <Clock3 size={13} />
                        {task.time}
                      </span>
                    )}

                    {task.category && (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </SectionCard>
  );
};

export default TodayRoutineForm;