import { Link } from "react-router-dom";
import { Founder } from "../types";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

export default function FounderTable({ founders }: { founders: Founder[] }) {
  if (!founders.length) return <div className="rounded border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">No founders match this view yet.</div>;

  return (
    <div className="overflow-hidden rounded border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Title / Company</th>
            <th className="px-4 py-3">Tags</th>
            <th className="px-4 py-3">Tracking</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3">Latest update</th>
            <th className="px-4 py-3">My status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {founders.map((founder) => (
            <tr key={founder.id} className="align-top">
              <td className="px-4 py-3 font-medium text-slate-950">{founder.fullName}</td>
              <td className="px-4 py-3 text-slate-600">{[founder.currentTitle, founder.currentCompany].filter(Boolean).join(" at ") || "-"}</td>
              <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{founder.tags?.map((tag) => <span key={tag.id} className="rounded bg-slate-100 px-2 py-1 text-xs">{tag.name}</span>)}</div></td>
              <td className="px-4 py-3">{founder.trackingCount || 0}</td>
              <td className="px-4 py-3 text-slate-600">{founder.primaryOwner?.name || "-"}</td>
              <td className="max-w-xs px-4 py-3 text-slate-600">{founder.latestUpdate?.title || "-"}</td>
              <td className="px-4 py-3"><StatusBadge status={founder.myTracking?.status} /></td>
              <td className="px-4 py-3"><PriorityBadge priority={founder.myTracking?.priority} /></td>
              <td className="px-4 py-3"><Link to={`/founders/${founder.id}`} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
