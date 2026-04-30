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
    <section className="rounded border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-950">Shared Notes</h2>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add shared note" className="flex-1 rounded border border-slate-300 px-3 py-2" />
        <button className="rounded bg-slate-900 px-4 py-2 text-sm text-white">Add</button>
      </form>
      <div className="mt-4 space-y-3">
        {notes.length ? notes.map((note) => (
          <div key={note.id} className="rounded border border-slate-200 p-3">
            <p className="text-sm text-slate-700">{note.body}</p>
            <p className="mt-2 text-xs text-slate-500">{note.author?.name} · {new Date(note.createdAt).toLocaleDateString()}</p>
          </div>
        )) : <p className="text-sm text-slate-500">No shared notes yet.</p>}
      </div>
    </section>
  );
}
