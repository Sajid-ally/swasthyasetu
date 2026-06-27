import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  LogOut,
  HeartPulse,
  Sparkles,
  Bell,
  ChevronRight,
  UserRound,
  RefreshCcw,
  Settings,
} from "lucide-react";

import FloatingSmartAdd from "../ai/FloatingSmartAdd";
import { useUser } from "../../context/UserContext";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Profile", path: "/profile", icon: User },
  { label: "Family", path: "/family", icon: Users },
  { label: "Routine", path: "/routine", icon: ClipboardList },
  { label: "Analysis", path: "/analysis", icon: BarChart3 },
  { label: "Timeline", path: "/timeline", icon: History },
  { label: "Emergency", path: "/emergency", icon: ShieldAlert },
  { label: "Privacy", path: "/privacy", icon: Lock },
];

const pageMeta = {
  "/": {
    title: "Health Dashboard",
    subtitle: "Your personal health intelligence center",
  },
  "/profile": {
    title: "Profile",
    subtitle: "Manage your personal health profile",
  },
  "/family": {
    title: "Family Health",
    subtitle: "Track and manage family members",
  },
  "/routine": {
    title: "Daily Routine",
    subtitle: "Monitor habits, activity, and daily health inputs",
  },
  "/analysis": {
    title: "AI Analysis",
    subtitle: "Understand trends, risks, and health patterns",
  },
  "/timeline": {
    title: "Health Timeline",
    subtitle: "View reports, symptoms, medicines, and health events",
  },
  "/emergency": {
    title: "Emergency",
    subtitle: "Quick access to emergency health information",
  },
  "/privacy": {
    title: "Privacy",
    subtitle: "Your health data security and permissions",
  },
};

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const dropdownRef = useRef(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currentPage = useMemo(() => {
    return (
      pageMeta[location.pathname] || {
        title: "SwasthyaSetu",
        subtitle: "Health AI Dashboard",
      }
    );
  }, [location.pathname]);

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    navigate("/login");
  };

  const handleSwitchUser = () => {
    setIsUserMenuOpen(false);
    logout();
    navigate("/login");
  };

  const handleGoToProfile = () => {
    setIsUserMenuOpen(false);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-primary/20 blur-[110px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute left-[40%] top-[20%] h-72 w-72 rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      <div className="relative flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col border-r border-white/10 bg-[#020617]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-lg shadow-primary/10">
                  <HeartPulse size={24} />
                </div>

                <div>
                  <h1 className="text-lg font-bold tracking-tight text-white">
                    SwasthyaSetu
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Health AI Dashboard
                  </p>
                </div>
              </div>

              <button
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/10 px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-200">
                <Sparkles size={14} />
                AI Health Engine Active
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-white/[0.04] text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                          }`}
                        >
                          <Icon size={18} />
                        </span>

                        {item.label}
                      </span>

                      <ChevronRight
                        size={16}
                        className={`transition ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-60"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold text-white">
                {userInitial}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  Logged in securely
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
              Use the top-right profile card to switch user or logout.
            </div>
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#020617]/80 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-white sm:text-xl">
                    {currentPage.title}
                  </h2>
                  <p className="mt-0.5 truncate text-xs text-slate-400 sm:text-sm">
                    {currentPage.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 sm:flex">
                  <Bell size={15} className="text-primary" />
                  Smart monitoring on
                </div>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2 transition ${
                      isUserMenuOpen
                        ? "border-primary/40 bg-primary/10"
                        : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-xs font-bold text-primary">
                      {userInitial}
                    </div>

                    <div className="hidden text-left sm:block">
                      <p className="max-w-32 truncate text-xs font-semibold text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[10px] text-slate-500">Active user</p>
                    </div>

                    <ChevronRight
                      size={15}
                      className={`text-slate-400 transition ${
                        isUserMenuOpen ? "rotate-90 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-3xl border border-white/10 bg-[#0f172a] shadow-2xl shadow-black/40">
                      <div className="border-b border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-sm font-bold text-primary">
                            {userInitial}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {user?.name || "User"}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                              Currently active profile
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={handleGoToProfile}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          <UserRound size={16} className="text-primary" />
                          View Profile
                        </button>

                        <button
                          onClick={handleSwitchUser}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          <RefreshCcw size={16} className="text-cyan-300" />
                          Switch User
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate("/privacy");
                          }}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          <Settings size={16} className="text-slate-300" />
                          Privacy Settings
                        </button>

                        <div className="my-2 h-px bg-white/10" />

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-5 pb-28 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>

        <FloatingSmartAdd />
      </div>
    </div>
  );
};

export default AppLayout;