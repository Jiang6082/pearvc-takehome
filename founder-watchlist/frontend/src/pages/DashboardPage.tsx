import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import FounderTable from "../components/FounderTable";
import UpdateCard from "../components/UpdateCard";
import { Founder, UpdateSignal } from "../types";

export default function DashboardPage() {
  const [updates, setUpdates] = useState<UpdateSignal[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);

  function load() {
    api.get("/updates", { params: { trackedByMe: true } }).then((res) => setUpdates(res.data));
    api.get("/founders", { params: { trackedByMe: true, sortBy: "recentUpdate" } }).then((res) => setFounders(res.data));
  }

  useEffect(load, []);

  async function patchUpdate(id: string, data: Partial<UpdateSignal>) {
    await api.patch(`/updates/${id}`, data);
    load();
  }

  const followUps = useMemo(() => {
    const now = Date.now();
    return founders.filter((founder) => {
      const tracking = founder.myTracking;
      const oldContact = !tracking?.lastContactedAt || now - new Date(tracking.lastContactedAt).getTime() > 90 * 24 * 60 * 60 * 1000;
      return tracking?.priority === "HIGH" || oldContact || (founder.trackingCount || 0) > 1;
    }).slice(0, 5);
  }, [founders]);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Dashboard</h1>
        <p className="text-sm text-slate-600">Who should you pay attention to now?</p>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-slate-950">Recent High-Signal Updates</h2>
        {updates.slice(0, 5).length ? updates.slice(0, 5).map((update) => <UpdateCard key={update.id} update={update} onPatch={patchUpdate} />) : <div className="rounded border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">No updates yet. Run mock ingestion to simulate new founder activity.</div>}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-slate-950">Suggested Follow-Ups</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {followUps.map((founder) => (
            <Link key={founder.id} to={`/founders/${founder.id}`} className="rounded border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-400">
              <h3 className="font-semibold text-slate-950">{founder.fullName}</h3>
              <p className="mt-1 text-sm text-slate-600">{founder.latestUpdate?.title || "Check in on tracking status"}</p>
              <p className="mt-2 text-xs text-slate-500">{founder.trackingCount || 0} investor(s) tracking · {founder.myTracking?.priority || "No"} priority</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-slate-950">My Tracked Founders</h2>
        <FounderTable founders={founders} />
      </section>
    </div>
  );
}
