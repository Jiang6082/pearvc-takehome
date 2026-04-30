import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import FounderForm, { FounderFormValues } from "../components/FounderForm";
import { Tag } from "../types";

export default function AddFounderPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/tags").then((res) => setTags(res.data));
  }, []);

  async function submit(values: FounderFormValues) {
    const res = await api.post("/founders", values);
    if (res.data.duplicateFound) setNotice("Existing founder found. You are now tracking that profile.");
    navigate(`/founders/${res.data.founder.id}`, { state: { duplicateFound: res.data.duplicateFound } });
  }

  return (
    <div className="max-w-3xl">
      <p className="eyebrow">New profile</p>
      <h1 className="page-title">Add Founder</h1>
      <p className="page-subtitle">Start with a name, then add only the context that helps you track follow-up.</p>
      {notice && <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800">{notice}</div>}
      <div className="mt-5"><FounderForm tags={tags} onSubmit={submit} /></div>
    </div>
  );
}
