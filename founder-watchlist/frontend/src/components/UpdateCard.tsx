import { Link } from "react-router-dom";
import { UpdateSignal } from "../types";

export default function UpdateCard({ update, onPatch }: { update: UpdateSignal; onPatch?: (id: string, data: Partial<UpdateSignal>) => void }) {
  return (
    <div className="panel p-4 hover:border-teal-700/30 hover:shadow-[0_20px_45px_rgba(15,23,42,0.1)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/founders/${update.founderId}`} className="font-semibold text-slate-950 hover:text-teal-800">{update.founder?.fullName || "Founder"}</Link>
            <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-800">{update.signalType.replace(/_/g, " ")}</span>
            {update.isImportant && <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">IMPORTANT</span>}
          </div>
          <h3 className="mt-3 text-base font-semibold leading-6 text-slate-950">{update.title}</h3>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{update.description}</p>
          <p className="mt-3 text-xs font-medium text-slate-500">{update.sourceName || "Unknown source"} · {new Date(update.detectedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button onClick={() => onPatch?.(update.id, { isImportant: !update.isImportant })} className="btn-secondary flex-1 px-3 py-2 sm:flex-none">{update.isImportant ? "Unmark" : "Important"}</button>
          <button onClick={() => onPatch?.(update.id, { isDismissed: true })} className="btn-secondary flex-1 px-3 py-2 sm:flex-none">Dismiss</button>
          <Link to={`/founders/${update.founderId}`} className="btn-primary w-full px-3 py-2 sm:w-auto">View Founder</Link>
        </div>
      </div>
    </div>
  );
}
