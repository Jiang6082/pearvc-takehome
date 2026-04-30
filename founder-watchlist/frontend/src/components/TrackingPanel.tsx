import { useState } from "react";
import { api } from "../api/client";
import { Founder, Priority, Status } from "../types";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

export default function TrackingPanel({ founder, onChange }: { founder: Founder; onChange: () => void }) {
  const tracking = founder.myTracking;
  const [privateNotes, setPrivateNotes] = useState(tracking?.privateNotes || "");
  const [status, setStatus] = useState<Status>(tracking?.status || "WATCHING");
  const [priority, setPriority] = useState<Priority>(tracking?.priority || "MEDIUM");

  async function track() {
    await api.post("/tracking", { founderId: founder.id, status, priority, privateNotes });
    onChange();
  }

  async function save() {
    if (!tracking) return track();
    await api.patch(`/tracking/${tracking.id}`, { status, priority, privateNotes });
    onChange();
  }

  async function untrack() {
    if (!tracking) return;
    await api.delete(`/tracking/${tracking.id}`);
    onChange();
  }

  async function contacted() {
    if (!tracking) return;
    await api.post(`/tracking/${tracking.id}/mark-contacted`);
    onChange();
  }

  return (
    <section className="rounded border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-950">Coordination</h2>
      <div className="mt-3 grid gap-3 text-sm">
        <div><span className="text-slate-500">Tracking count:</span> {founder.trackingCount || 0}</div>
        <div><span className="text-slate-500">Primary owner:</span> {founder.primaryOwner?.name || "-"}</div>
        <div className="flex gap-2"><StatusBadge status={tracking?.status} /><PriorityBadge priority={tracking?.priority} /></div>
        <div><span className="text-slate-500">Last contacted:</span> {tracking?.lastContactedAt ? new Date(tracking.lastContactedAt).toLocaleDateString() : "-"}</div>
      </div>
      <div className="mt-4 space-y-3">
        <select value={status} onChange={(event) => setStatus(event.target.value as Status)} className="w-full rounded border border-slate-300 px-3 py-2"><option>WATCHING</option><option>WARM</option><option>ACTIVE</option><option>PASSED</option></select>
        <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)} className="w-full rounded border border-slate-300 px-3 py-2"><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select>
        <textarea value={privateNotes} onChange={(event) => setPrivateNotes(event.target.value)} rows={4} placeholder="Private tracking notes" className="w-full rounded border border-slate-300 px-3 py-2" />
        <div className="flex flex-wrap gap-2">
          <button onClick={save} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">{tracking ? "Save Tracking" : "Track Founder"}</button>
          {tracking && <button onClick={contacted} className="rounded border border-slate-300 px-3 py-2 text-sm">Mark Contacted</button>}
          {tracking && <button onClick={untrack} className="rounded border border-slate-300 px-3 py-2 text-sm">Untrack</button>}
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-sm font-medium text-slate-700">Investors tracking</h3>
        <div className="mt-2 space-y-2">
          {founder.trackingRelationships?.map((item) => <div key={item.id} className="rounded bg-slate-50 p-2 text-sm">{item.user?.name} {item.isOwner ? "· Owner" : ""}</div>)}
        </div>
      </div>
    </section>
  );
}
