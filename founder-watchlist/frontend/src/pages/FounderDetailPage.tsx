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
      <Link to="/founders" className="text-sm font-semibold text-teal-800 hover:underline">Back to founders</Link>
      <div className="panel overflow-hidden">
        <div className="border-b border-stone-200 bg-slate-950 px-6 py-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">Founder profile</p>
        </div>
        <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-slate-950">{founder.fullName}</h1>
            <p className="mt-2 text-base text-slate-600">{[founder.currentTitle, founder.currentCompany].filter(Boolean).join(" at ") || "No current role"}</p>
            <p className="mt-1 text-sm text-slate-500">{founder.location || ""}</p>
            {founder.linkedinUrl && <a href={founder.linkedinUrl} target="_blank" className="mt-3 inline-block text-sm font-semibold text-teal-800 underline decoration-teal-800/30 underline-offset-4">LinkedIn</a>}
          </div>
          <div className="flex max-w-md flex-wrap gap-2">{founder.tags.map((tag) => <span key={tag.id} className="chip">{tag.name}</span>)}</div>
        </div>
        {founder.bio && <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-700">{founder.bio}</p>}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <TrackingPanel founder={founder} onChange={load} />
          <NotesPanel founderId={founder.id} notes={founder.sharedNotes || []} onChange={load} />
        </div>
        <section className="space-y-3">
          <div className="panel p-5">
            <h2 className="section-title">Add Manual Update</h2>
            <form onSubmit={addManual} className="mt-3 grid gap-3">
              <input value={manual.title} onChange={(event) => setManual({ ...manual, title: event.target.value })} placeholder="Update title" className="input" />
              <textarea value={manual.description} onChange={(event) => setManual({ ...manual, description: event.target.value })} placeholder="What changed?" rows={3} className="input" />
              <button className="btn-primary w-fit">Add Update</button>
            </form>
          </div>
          <h2 className="section-title">Update Timeline</h2>
          {(founder.updates || []).length ? founder.updates!.map((update) => <UpdateCard key={update.id} update={{ ...update, founder }} onPatch={patchUpdate} />) : <div className="empty-state">No updates yet.</div>}
        </section>
      </div>
    </div>
  );
}
