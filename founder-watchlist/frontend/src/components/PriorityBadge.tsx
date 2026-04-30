import { Priority } from "../types";

const styles: Record<Priority, string> = {
  HIGH: "border-rose-200 bg-rose-50 text-rose-800",
  MEDIUM: "border-sky-200 bg-sky-50 text-sky-800",
  LOW: "border-slate-200 bg-slate-50 text-slate-700",
};

export default function PriorityBadge({ priority }: { priority?: Priority | null }) {
  if (!priority) return <span className="text-slate-400">-</span>;
  return <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${styles[priority]}`}>{priority}</span>;
}
