import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import NotesPanel from "../components/NotesPanel";
import TrackingPanel from "../components/TrackingPanel";
import UpdateCard from "../components/UpdateCard";
import { Founder, SignalType, UpdateSignal } from "../types";

export default function FounderDetailPage() {
  const { id } = useParams();
  const [founder, setFounder] = useState<Founder | null>(null);
  const [manual, setManual] = useState({ signalType: "MANUAL" as SignalType, title: "", description: "" });

  function load() {
    api.get(`/founders/${id}`).then((res) => setFounder(res.data));
  }

  useEffect(load, [id]);

  async function patchUpdate(updateId: string, data: Partial<UpdateSignal>) {
    await api.patch(`/updates/${updateId}`, data);
    load();
  }

  async function addManual(event: FormEvent) {
    event.preventDefault();
    if (!founder || !manual.title.trim()) return;
    await api.post("/updates", { founderId: founder.id, ...manual, sourceName: "Manual" });
    setManual({ signalType: "MANUAL", title: "", description: "" });
    load();
  }

  if (!founder) return <p className="text-sm text-slate-600">Loading founder...</p>;

  return (
    <div className="space-y-5">
      <Link to="/founders" className="text-sm text-slate-600 hover:underline">Back to founders</Link>
      <div className="rounded border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">{founder.fullName}</h1>
            <p className="mt-1 text-slate-600">{[founder.currentTitle, founder.currentCompany].filter(Boolean).join(" at ") || "No current role"}</p>
            <p className="mt-1 text-sm text-slate-500">{founder.location || ""}</p>
            {founder.linkedinUrl && <a href={founder.linkedinUrl} target="_blank" className="mt-2 inline-block text-sm font-medium text-slate-900 underline">LinkedIn</a>}
          </div>
          <div className="flex flex-wrap gap-2">{founder.tags.map((tag) => <span key={tag.id} className="rounded bg-slate-100 px-2 py-1 text-xs">{tag.name}</span>)}</div>
        </div>
        {founder.bio && <p className="mt-4 max-w-3xl text-sm text-slate-700">{founder.bio}</p>}
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <TrackingPanel founder={founder} onChange={load} />
          <NotesPanel founderId={founder.id} notes={founder.sharedNotes || []} onChange={load} />
        </div>
        <section className="space-y-3">
          <div className="rounded border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-950">Add Manual Update</h2>
            <form onSubmit={addManual} className="mt-3 grid gap-3">
              <input value={manual.title} onChange={(event) => setManual({ ...manual, title: event.target.value })} placeholder="Update title" className="rounded border border-slate-300 px-3 py-2" />
              <textarea value={manual.description} onChange={(event) => setManual({ ...manual, description: event.target.value })} placeholder="What changed?" rows={3} className="rounded border border-slate-300 px-3 py-2" />
              <button className="w-fit rounded bg-slate-900 px-4 py-2 text-sm text-white">Add Update</button>
            </form>
          </div>
          <h2 className="font-semibold text-slate-950">Update Timeline</h2>
          {(founder.updates || []).length ? founder.updates!.map((update) => <UpdateCard key={update.id} update={{ ...update, founder }} onPatch={patchUpdate} />) : <div className="rounded border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">No updates yet.</div>}
        </section>
      </div>
    </div>
  );
}
