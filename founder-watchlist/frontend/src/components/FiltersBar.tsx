import { Tag } from "../types";

export default function FiltersBar({
  filters,
  tags,
  onChange,
}: {
  filters: Record<string, string | boolean>;
  tags: Tag[];
  onChange: (filters: Record<string, string | boolean>) => void;
}) {
  const set = (key: string, value: string | boolean) => onChange({ ...filters, [key]: value });
  return (
    <div className="grid gap-3 rounded border border-slate-200 bg-white p-4 md:grid-cols-6">
      <input value={String(filters.search || "")} onChange={(event) => set("search", event.target.value)} placeholder="Search founders" className="rounded border border-slate-300 px-3 py-2 md:col-span-2" />
      <select value={String(filters.status || "")} onChange={(event) => set("status", event.target.value)} className="rounded border border-slate-300 px-3 py-2">
        <option value="">Any status</option>
        <option>WATCHING</option><option>WARM</option><option>ACTIVE</option><option>PASSED</option>
      </select>
      <select value={String(filters.priority || "")} onChange={(event) => set("priority", event.target.value)} className="rounded border border-slate-300 px-3 py-2">
        <option value="">Any priority</option>
        <option>HIGH</option><option>MEDIUM</option><option>LOW</option>
      </select>
      <select value={String(filters.tag || "")} onChange={(event) => set("tag", event.target.value)} className="rounded border border-slate-300 px-3 py-2">
        <option value="">Any tag</option>
        {tags.map((tag) => <option key={tag.id}>{tag.name}</option>)}
      </select>
      <select value={String(filters.sortBy || "recentUpdate")} onChange={(event) => set("sortBy", event.target.value)} className="rounded border border-slate-300 px-3 py-2">
        <option value="recentUpdate">Recent update</option>
        <option value="lastContacted">Last contacted</option>
        <option value="priority">Priority</option>
        <option value="name">Name</option>
        <option value="newest">Newest</option>
      </select>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={Boolean(filters.trackedByMe)} onChange={(event) => set("trackedByMe", event.target.checked)} />
        Tracked by me
      </label>
    </div>
  );
}
