import { Bell, Plus, Search } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
      <div>
        <h2 className="text-2xl font-bold text-white">Healthcare Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            placeholder="Search health metrics..."
            className="w-72 rounded-full border border-border bg-surface px-11 py-3 text-sm text-white placeholder:text-muted outline-none transition-all duration-200 focus:border-primary"
          />
        </div>

        <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-90">
          <Plus size={16} />
          <span>Smart Add</span>
        </button>

        <button className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all duration-200 hover:bg-surfaceLight hover:text-white">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primaryLight">
            P
          </div>
          <div className="hidden text-left xl:block">
            <p className="text-sm font-medium text-white">Pratibha</p>
            <p className="text-xs text-muted">Patient</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;