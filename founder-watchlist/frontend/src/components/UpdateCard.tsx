import { Link } from "react-router-dom";
import { UpdateSignal } from "../types";

export default function UpdateCard({ update, onPatch }: { update: UpdateSignal; onPatch?: (id: string, data: Partial<UpdateSignal>) => void }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Link to={`/founders/${update.founderId}`} className="font-semibold text-slate-950 hover:underline">{update.founder?.fullName || "Founder"}</Link>
            <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">{update.signalType}</span>
            {update.isImportant && <span className="rounded bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700">IMPORTANT</span>}
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{update.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{update.description}</p>
          <p className="mt-2 text-xs text-slate-500">{update.sourceName || "Unknown source"} · {new Date(update.detectedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onPatch?.(update.id, { isImportant: !update.isImportant })} className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Important</button>
          <button onClick={() => onPatch?.(update.id, { isDismissed: true })} className="rounded border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Dismiss</button>
          <Link to={`/founders/${update.founderId}`} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">View Founder</Link>
        </div>
      </div>
    </div>
  );
}
