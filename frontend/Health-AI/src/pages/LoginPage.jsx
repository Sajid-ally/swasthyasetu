import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, LogIn, ShieldCheck, UserRound } from "lucide-react";

import { loginUser } from "../services/dashboardApi";
import { useUser } from "../context/UserContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setMessage("Please enter name, email, phone, or user ID.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await loginUser(identifier.trim());

      if (!res.success) {
        setMessage(res.message || "Login failed.");
        return;
      }

      login(res.user);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Backend not reachable. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/15 text-primary">
            <HeartPulse size={30} />
          </div>

          <h1 className="text-3xl font-bold text-white">
            SwasthyaSetu
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Login using your saved name, email, phone number, or user ID.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              User Identity
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Example: Nishant / nishant@gmail.com / user_1"
                className="w-full rounded-2xl border border-white/10 bg-[#020617] px-4 py-3 pl-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-primary"
              />
            </div>
          </div>

          {message ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primaryLight disabled:opacity-60"
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <ShieldCheck size={16} />
            <span className="text-sm font-semibold">Demo Login Examples</span>
          </div>

          <div className="space-y-1 text-xs text-slate-300">
            <p>Nishant</p>
            <p>nishant@gmail.com</p>
            <p>9876543210</p>
            <p>user_1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;