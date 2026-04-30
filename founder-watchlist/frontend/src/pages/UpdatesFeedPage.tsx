import { useEffect, useState } from "react";
import { api } from "../api/client";
import UpdateCard from "../components/UpdateCard";
import { SignalType, UpdateSignal } from "../types";

const signalTypes: SignalType[] = ["JOB_CHANGE", "COMPANY_STARTED", "PRODUCT_LAUNCH", "FUNDRAISING", "HIRING", "COFOUNDER_SEARCH", "SOCIAL_TRACTION", "COMPANY_PIVOT", "MANUAL"];

export default function UpdatesFeedPage() {
  const [updates, setUpdates] = useState<UpdateSignal[]>([]);
  const [filters, setFilters] = useState({ search: "", signalType: "", isImportant: false, trackedByMe: false, includeDismissed: false });
  const [loading, setLoading] = useState(true);

  function load() {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "" && value !== false));
    setLoading(true);
    api.get("/updates", { params }).then((res) => setUpdates(res.data)).finally(() => setLoading(false));
  }

  useEffect(load, [filters]);

  async function patch(id: string, data: Partial<UpdateSignal>) {
    await api.patch(`/updates/${id}`, data);
    load();
  }

  async function runIngestion() {
    await api.post("/updates/mock-ingest");
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold text-slate-950">Updates</h1><p className="text-sm text-slate-600">Signals that make founders worth a second look.</p></div>
        <button onClick={runIngestion} className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">Run Mock Ingestion</button>
      </div>
      <div className="grid gap-3 rounded border border-slate-200 bg-white p-4 md:grid-cols-5">
        <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Founder name" className="rounded border border-slate-300 px-3 py-2" />
        <select value={filters.signalType} onChange={(event) => setFilters({ ...filters, signalType: event.target.value })} className="rounded border border-slate-300 px-3 py-2">
          <option value="">Any signal</option>
          {signalTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.isImportant} onChange={(event) => setFilters({ ...filters, isImportant: event.target.checked })} /> Important only</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.trackedByMe} onChange={(event) => setFilters({ ...filters, trackedByMe: event.target.checked })} /> Tracked by me</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.includeDismissed} onChange={(event) => setFilters({ ...filters, includeDismissed: event.target.checked })} /> Include dismissed</label>
      </div>
      {loading ? <p className="text-sm text-slate-600">Loading updates...</p> : updates.length ? <div className="space-y-3">{updates.map((update) => <UpdateCard key={update.id} update={update} onPatch={patch} />)}</div> : <div className="rounded border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">No updates yet. Run mock ingestion to simulate new founder activity.</div>}
    </div>
  );
}
