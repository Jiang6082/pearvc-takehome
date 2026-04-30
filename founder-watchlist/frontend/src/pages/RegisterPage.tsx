import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to register");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <form onSubmit={submit} className="panel w-full max-w-md p-8 sm:p-10">
        <p className="eyebrow">New investor</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Create account</h1>
        {error && <div className="mt-5 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</div>}
        <label className="mt-6 block text-sm font-semibold text-slate-700">Name</label>
        <input value={name} onChange={(event) => setName(event.target.value)} className="input mt-2 w-full" />
        <label className="mt-4 block text-sm font-semibold text-slate-700">Email</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)} className="input mt-2 w-full" />
        <label className="mt-4 block text-sm font-semibold text-slate-700">Password</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input mt-2 w-full" />
        <button className="btn-primary mt-6 w-full py-3">Register</button>
        <p className="mt-5 text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-teal-800 underline decoration-teal-800/30 underline-offset-4">Log in</Link></p>
      </form>
    </div>
  );
}
