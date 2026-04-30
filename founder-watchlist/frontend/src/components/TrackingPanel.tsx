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
    <section className="panel p-5">
      <h2 className="section-title">Coordination</h2>
      <div className="mt-4 grid gap-3 text-sm">
        <div className="flex justify-between border-b border-stone-100 pb-2"><span className="text-slate-500">Tracking count</span> <span className="font-semibold">{founder.trackingCount || 0}</span></div>
        <div className="flex justify-between border-b border-stone-100 pb-2"><span className="text-slate-500">Primary owner</span> <span className="font-semibold">{founder.primaryOwner?.name || "-"}</span></div>
        <div className="flex gap-2"><StatusBadge status={tracking?.status} /><PriorityBadge priority={tracking?.priority} /></div>
        <div className="flex justify-between"><span className="text-slate-500">Last contacted</span> <span className="font-semibold">{tracking?.lastContactedAt ? new Date(tracking.lastContactedAt).toLocaleDateString() : "-"}</span></div>
      </div>
      <div className="mt-4 space-y-3">
        <select value={status} onChange={(event) => setStatus(event.target.value as Status)} className="input w-full"><option>WATCHING</option><option>WARM</option><option>ACTIVE</option><option>PASSED</option></select>
        <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)} className="input w-full"><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select>
        <textarea value={privateNotes} onChange={(event) => setPrivateNotes(event.target.value)} rows={4} placeholder="Private tracking notes" className="input w-full" />
        <div className="flex flex-wrap gap-2">
          <button onClick={save} className="btn-primary px-3 py-2">{tracking ? "Save Tracking" : "Track Founder"}</button>
          {tracking && <button onClick={contacted} className="btn-secondary px-3 py-2">Mark Contacted</button>}
          {tracking && <button onClick={untrack} className="btn-secondary px-3 py-2">Untrack</button>}
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-700">Investors tracking</h3>
        <div className="mt-2 space-y-2">
          {founder.trackingRelationships?.map((item) => <div key={item.id} className="rounded-md border border-stone-200 bg-stone-50 p-2 text-sm font-medium text-slate-700">{item.user?.name} {item.isOwner ? "· Owner" : ""}</div>)}
        </div>
      </div>
    </section>
  );
}
