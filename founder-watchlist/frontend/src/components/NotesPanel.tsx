import { FormEvent, useState } from "react";
import { api } from "../api/client";
import { SharedNote } from "../types";

export default function NotesPanel({ founderId, notes, onChange }: { founderId: string; notes: SharedNote[]; onChange: () => void }) {
  const [body, setBody] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    await api.post("/notes", { founderId, body });
    setBody("");
    onChange();
  }

  return (
    <section className="panel p-5">
      <h2 className="section-title">Shared Notes</h2>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add shared note" className="input min-w-0 flex-1" />
        <button className="btn-primary px-4 py-2">Add</button>
      </form>
      <div className="mt-4 space-y-3">
        {notes.length ? notes.map((note) => (
          <div key={note.id} className="rounded-md border border-stone-200 bg-stone-50/70 p-3">
            <p className="text-sm leading-6 text-slate-700">{note.body}</p>
            <p className="mt-2 text-xs font-medium text-slate-500">{note.author?.name} · {new Date(note.createdAt).toLocaleDateString()}</p>
          </div>
        )) : <p className="text-sm text-slate-500">No shared notes yet.</p>}
      </div>
    </section>
  );
}
