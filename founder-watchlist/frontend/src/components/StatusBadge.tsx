import { Status } from "../types";

const styles: Record<Status, string> = {
  WATCHING: "bg-slate-100 text-slate-700",
  WARM: "bg-amber-100 text-amber-800",
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PASSED: "bg-zinc-100 text-zinc-600",
};

export default function StatusBadge({ status }: { status?: Status | null }) {
  if (!status) return <span className="text-slate-400">-</span>;
  return <span className={`rounded px-2 py-1 text-xs font-medium ${styles[status]}`}>{status}</span>;
}
