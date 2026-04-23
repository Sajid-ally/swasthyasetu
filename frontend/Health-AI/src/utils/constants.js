import {
  LayoutDashboard,
  UserRound,
  Users,
  CalendarCheck,
  BarChart3,
  History,
  ShieldAlert,
  Lock,
} from "lucide-react";

export const APP_NAME = "SwasthyaSetu";

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", path: "/profile", icon: UserRound },
  { label: "Family Tree", path: "/family", icon: Users },
  { label: "Daily Routine", path: "/routine", icon: CalendarCheck },
  { label: "Analysis", path: "/analysis", icon: BarChart3 },
  { label: "Health Timeline", path: "/timeline", icon: History },
  { label: "Emergency", path: "/emergency", icon: ShieldAlert },
  { label: "Privacy", path: "/privacy", icon: Lock },
];