import { Founder } from "@prisma/client";

function normalize(value?: string | null) {
  return (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSimilarity(a: string, b: string) {
  const aTokens = new Set(normalize(a).split(" ").filter(Boolean));
  const bTokens = new Set(normalize(b).split(" ").filter(Boolean));
  if (!aTokens.size || !bTokens.size) return 0;
  const intersection = [...aTokens].filter((token) => bTokens.has(token)).length;
  const union = new Set([...aTokens, ...bTokens]).size;
  return intersection / union;
}

export function findLikelyDuplicate(
  input: { fullName: string; currentCompany?: string | null },
  founders: Founder[]
) {
  const inputCompany = normalize(input.currentCompany);

  return founders.find((founder) => {
    const nameScore = tokenSimilarity(input.fullName, founder.fullName);
    const companyMatches =
      inputCompany && normalize(founder.currentCompany) === inputCompany;

    return nameScore >= 0.8 && (!inputCompany || companyMatches);
  });
}
