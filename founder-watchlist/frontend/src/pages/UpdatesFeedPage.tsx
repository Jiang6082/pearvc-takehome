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
      <div className="page-header">
        <div>
          <p className="eyebrow">Signal feed</p>
          <h1 className="page-title">Updates</h1>
          <p className="page-subtitle">Signals that make founders worth a second look.</p>
        </div>
        <button onClick={runIngestion} className="btn-primary">Run Mock Ingestion</button>
      </div>
      <div className="panel grid gap-3 p-4 md:grid-cols-5">
        <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Founder name" className="input" />
        <select value={filters.signalType} onChange={(event) => setFilters({ ...filters, signalType: event.target.value })} className="input">
          <option value="">Any signal</option>
          {signalTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
        <label className="flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium"><input type="checkbox" checked={filters.isImportant} onChange={(event) => setFilters({ ...filters, isImportant: event.target.checked })} className="h-4 w-4 accent-teal-700" /> Important only</label>
        <label className="flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium"><input type="checkbox" checked={filters.trackedByMe} onChange={(event) => setFilters({ ...filters, trackedByMe: event.target.checked })} className="h-4 w-4 accent-teal-700" /> Tracked by me</label>
        <label className="flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium"><input type="checkbox" checked={filters.includeDismissed} onChange={(event) => setFilters({ ...filters, includeDismissed: event.target.checked })} className="h-4 w-4 accent-teal-700" /> Include dismissed</label>
      </div>
      {loading ? <p className="text-sm text-slate-600">Loading updates...</p> : updates.length ? <div className="space-y-3">{updates.map((update) => <UpdateCard key={update.id} update={update} onPatch={patch} />)}</div> : <div className="empty-state">No updates yet. Run mock ingestion to simulate new founder activity.</div>}
    </div>
  );
}
