import { FormEvent, useState } from "react";
import { Priority, Status, Tag } from "../types";

export type FounderFormValues = {
  fullName: string;
  linkedinUrl: string;
  currentTitle: string;
  currentCompany: string;
  location: string;
  bio: string;
  tags: string[];
  status: Status;
  priority: Priority;
  privateNotes: string;
};

export default function FounderForm({ tags, onSubmit }: { tags: Tag[]; onSubmit: (values: FounderFormValues) => Promise<void> }) {
  const [values, setValues] = useState<FounderFormValues>({
    fullName: "",
    linkedinUrl: "",
    currentTitle: "",
    currentCompany: "",
    location: "",
    bio: "",
    tags: [],
    status: "WATCHING",
    priority: "MEDIUM",
    privateNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof FounderFormValues, value: string | string[]) => setValues((current) => ({ ...current, [key]: value }));
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try { await onSubmit(values); } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded border border-slate-200 bg-white p-6">
      <div>
        <label className="text-sm font-medium text-slate-700">Full name</label>
        <input required value={values.fullName} onChange={(event) => set("fullName", event.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="text-sm font-medium text-slate-700">LinkedIn URL</label><input value={values.linkedinUrl} onChange={(event) => set("linkedinUrl", event.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" /></div>
        <div><label className="text-sm font-medium text-slate-700">Location</label><input value={values.location} onChange={(event) => set("location", event.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" /></div>
        <div><label className="text-sm font-medium text-slate-700">Current title</label><input value={values.currentTitle} onChange={(event) => set("currentTitle", event.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" /></div>
        <div><label className="text-sm font-medium text-slate-700">Current company</label><input value={values.currentCompany} onChange={(event) => set("currentCompany", event.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" /></div>
      </div>
      <div><label className="text-sm font-medium text-slate-700">Bio</label><textarea value={values.bio} onChange={(event) => set("bio", event.target.value)} rows={3} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" /></div>
      <div>
        <label className="text-sm font-medium text-slate-700">Tags</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm">
              <input type="checkbox" checked={values.tags.includes(tag.name)} onChange={(event) => set("tags", event.target.checked ? [...values.tags, tag.name] : values.tags.filter((name) => name !== tag.name))} />
              {tag.name}
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="text-sm font-medium text-slate-700">Status</label><select value={values.status} onChange={(event) => set("status", event.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2"><option>WATCHING</option><option>WARM</option><option>ACTIVE</option><option>PASSED</option></select></div>
        <div><label className="text-sm font-medium text-slate-700">Priority</label><select value={values.priority} onChange={(event) => set("priority", event.target.value)} className="mt-1 w-full rounded border border-slate-300 px-3 py-2"><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select></div>
      </div>
      <div><label className="text-sm font-medium text-slate-700">Private notes</label><textarea value={values.privateNotes} onChange={(event) => set("privateNotes", event.target.value)} rows={3} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" /></div>
      <button disabled={submitting} className="rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60">{submitting ? "Adding..." : "Add Founder"}</button>
    </form>
  );
}
