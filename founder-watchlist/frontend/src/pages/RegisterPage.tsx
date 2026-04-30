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
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Create account</h1>
        {error && <div className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        <label className="mt-5 block text-sm font-medium">Name</label>
        <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
        <label className="mt-4 block text-sm font-medium">Email</label>
        <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
        <label className="mt-4 block text-sm font-medium">Password</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
        <button className="mt-6 w-full rounded bg-slate-900 px-4 py-2 font-medium text-white">Register</button>
        <p className="mt-4 text-sm text-slate-600">Already have an account? <Link to="/login" className="font-medium text-slate-950 underline">Log in</Link></p>
      </form>
    </div>
  );
}
