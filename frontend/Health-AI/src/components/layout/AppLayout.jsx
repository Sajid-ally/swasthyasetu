import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  ClipboardList,
  BarChart3,
  History,
  ShieldAlert,
  Lock,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    label: "Family",
    path: "/family",
    icon: Users,
  },
  {
    label: "Routine",
    path: "/routine",
    icon: ClipboardList,
  },
  {
    label: "Analysis",
    path: "/analysis",
    icon: BarChart3,
  },
  {
    label: "Timeline",
    path: "/timeline",
    icon: History,
  },
  {
    label: "Emergency",
    path: "/emergency",
    icon: ShieldAlert,
  },
  {
    label: "Privacy",
    path: "/privacy",
    icon: Lock,
  },
];

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-[#020617] p-5 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">
            SwasthyaSetu
          </h1>

          {/* Close button (mobile) */}
          <button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#020617] px-5 py-4">
          <button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <h2 className="text-sm text-slate-400">
            Health Dashboard
          </h2>

          <div className="text-sm text-slate-400">
            Welcome 👋
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;