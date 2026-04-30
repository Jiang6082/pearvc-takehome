import { Link } from "react-router-dom";
import { Founder } from "../types";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

export default function FounderTable({ founders }: { founders: Founder[] }) {
  if (!founders.length) return <div className="empty-state">No founders match this view yet.</div>;

  return (
    <>
    <div className="grid gap-3 md:hidden">
      {founders.map((founder) => (
        <Link key={founder.id} to={`/founders/${founder.id}`} className="panel block p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-950">{founder.fullName}</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">{[founder.currentTitle, founder.currentCompany].filter(Boolean).join(" at ") || "-"}</p>
            </div>
            <span className="chip">{founder.trackingCount || 0} tracking</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">{founder.tags?.map((tag) => <span key={tag.id} className="chip">{tag.name}</span>)}</div>
          <p className="mt-3 text-sm leading-5 text-slate-600">{founder.latestUpdate?.title || "No recent update"}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge status={founder.myTracking?.status} />
            <PriorityBadge priority={founder.myTracking?.priority} />
          </div>
        </Link>
      ))}
    </div>
    <div className="panel hidden overflow-hidden md:block">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-[0.1em] text-slate-500">
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
        <tbody className="divide-y divide-stone-100 bg-white">
          {founders.map((founder) => (
            <tr key={founder.id} className="align-top hover:bg-teal-50/35">
              <td className="px-4 py-4 font-semibold text-slate-950">{founder.fullName}</td>
              <td className="px-4 py-4 text-slate-600">{[founder.currentTitle, founder.currentCompany].filter(Boolean).join(" at ") || "-"}</td>
              <td className="px-4 py-4"><div className="flex flex-wrap gap-1.5">{founder.tags?.map((tag) => <span key={tag.id} className="chip">{tag.name}</span>)}</div></td>
              <td className="px-4 py-4 font-medium text-slate-800">{founder.trackingCount || 0}</td>
              <td className="px-4 py-4 text-slate-600">{founder.primaryOwner?.name || "-"}</td>
              <td className="max-w-xs px-4 py-4 leading-5 text-slate-600">{founder.latestUpdate?.title || "-"}</td>
              <td className="px-4 py-4"><StatusBadge status={founder.myTracking?.status} /></td>
              <td className="px-4 py-4"><PriorityBadge priority={founder.myTracking?.priority} /></td>
              <td className="px-4 py-4"><Link to={`/founders/${founder.id}`} className="btn-primary px-3 py-2">View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    </>
  );
}
