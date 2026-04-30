import { Status } from "../types";

const styles: Record<Status, string> = {
  WATCHING: "border-slate-200 bg-slate-50 text-slate-700",
  WARM: "border-amber-200 bg-amber-50 text-amber-800",
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-800",
  PASSED: "border-zinc-200 bg-zinc-50 text-zinc-600",
};

export default function StatusBadge({ status }: { status?: Status | null }) {
  if (!status) return <span className="text-slate-400">-</span>;
  return <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
