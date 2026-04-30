import { Priority } from "../types";

const styles: Record<Priority, string> = {
  HIGH: "bg-rose-100 text-rose-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  LOW: "bg-slate-100 text-slate-700",
};

export default function PriorityBadge({ priority }: { priority?: Priority | null }) {
  if (!priority) return <span className="text-slate-400">-</span>;
  return <span className={`rounded px-2 py-1 text-xs font-medium ${styles[priority]}`}>{priority}</span>;
}
