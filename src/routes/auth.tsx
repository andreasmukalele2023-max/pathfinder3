import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Cpu, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Points Matrix Namibia" },
      {
        name: "description",
        content:
          "Create a free Points Matrix account to save your NSSCO and NSSCAS grades, shortlisted courses and admission points across every device.",
      },
      { property: "og:title", content: "Sign in — Points Matrix Namibia" },
      {
        property: "og:description",
        content: "Save your Grade 12 grades and course shortlist securely and pick up where you left off.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "err" | "ok"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        setMsg({ tone: "ok", text: "Account created. Check your email to confirm, then sign in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      }
    } catch (err) {
      setMsg({ tone: "err", text: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setMsg(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
      extraParams: { prompt: "select_account" },
    });
    if (result.error) {
      setMsg({ tone: "err", text: result.error.message });
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden px-4 py-10">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/50 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Points Matrix
        </Link>

        <div className="glass rounded-3xl p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] glow-primary">
              <Cpu className="h-5 w-5 text-[#0b0f19]" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-black">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-[11px] text-white/50">Keep your grades and shortlist saved.</p>
            </div>
          </div>

          <button
            onClick={google}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold transition hover:bg-white/10 disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1a6.2 6.2 0 1 1 0-12.4c1.9 0 3.2.8 4 1.5l2.7-2.6C17 3 14.7 2 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.9H12z" />
            </svg>
            Continue with Google
          </button>

          <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/30">
            <span className="h-px flex-1 bg-white/10" /> or email <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={submit} className="space-y-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm placeholder:text-white/30 focus:border-[var(--neon-cyan)]/60 focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm placeholder:text-white/30 focus:border-[var(--neon-cyan)]/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] py-2.5 text-xs font-bold text-[#0b0f19] transition hover:scale-[1.01] disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {msg && (
            <p
              className={`mt-3 rounded-xl border p-2.5 text-[11px] ${
                msg.tone === "err"
                  ? "border-[var(--destructive)]/40 bg-[var(--destructive)]/10 text-[var(--destructive)]"
                  : "border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)]"
              }`}
            >
              {msg.text}
            </p>
          )}

          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setMsg(null);
            }}
            className="mt-4 w-full text-center text-[11px] text-white/50 transition hover:text-white"
          >
            {mode === "signin" ? "New here? Create a free account" : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
