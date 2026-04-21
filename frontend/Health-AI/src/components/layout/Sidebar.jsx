import { NavLink } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { APP_NAME, NAV_ITEMS } from "../../utils/constants";

const Sidebar = () => {
  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-border bg-background px-5 py-6 text-white md:flex">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-primaryLight">{APP_NAME}</h1>
        <p className="mt-1 text-sm text-muted">Vitals & Wellness</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border border-primary/30 bg-primary/20 text-white shadow-soft"
                    : "text-slate-300 hover:bg-surfaceLight hover:text-white"
                }`
              }
            >
              <span className="flex items-center justify-center rounded-lg bg-white/5 p-2">
                <Icon size={16} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition-all duration-200 hover:bg-red-500/20">
        <ShieldAlert size={16} />
        <span>Emergency Profile</span>
      </button>
    </aside>
  );
};

export default Sidebar;