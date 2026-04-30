import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to log in");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_24px_80px_rgba(16,24,40,0.14)] md:grid md:grid-cols-[1fr_420px]">
        <section className="bg-slate-950 p-8 text-white sm:p-10">
          <div className="flex h-full min-h-[360px] flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-500 text-sm font-bold text-slate-950">FW</div>
              <p className="mt-10 text-sm font-semibold uppercase tracking-[0.16em] text-teal-200">Founder Watchlist</p>
              <h1 className="mt-3 max-w-md text-4xl font-semibold leading-tight">Track promising people before they become formal deals.</h1>
            </div>
            <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-md border border-white/10 bg-white/5 p-3">Signals</div>
              <div className="rounded-md border border-white/10 bg-white/5 p-3">Notes</div>
              <div className="rounded-md border border-white/10 bg-white/5 p-3">Follow-up</div>
            </div>
          </div>
        </section>
        <form onSubmit={submit} className="p-8 sm:p-10">
          <p className="eyebrow">Welcome back</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Log in</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Use the seeded demo investor account to explore the workflow.</p>
          {error && <div className="mt-5 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</div>}
          <label className="mt-6 block text-sm font-semibold text-slate-700">Email</label>
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-2 w-full" />
          <label className="mt-4 block text-sm font-semibold text-slate-700">Password</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input mt-2 w-full" />
          <button className="btn-primary mt-6 w-full py-3">Log in</button>
          <p className="mt-5 text-sm text-slate-600">Need an account? <Link to="/register" className="font-semibold text-teal-800 underline decoration-teal-800/30 underline-offset-4">Register</Link></p>
        </form>
      </div>
    </div>
  );
}
