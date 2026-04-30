import { Response } from "express";
import { z } from "zod";
import { AuthedRequest } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import { createFounderForUser, deleteFounder, getFounderById, listFounders, updateFounder } from "../services/founders.service.js";

const founderSchema = z.object({
  fullName: z.string().min(1),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  currentTitle: z.string().optional(),
  currentCompany: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  profileImageUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["WATCHING", "WARM", "ACTIVE", "PASSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  privateNotes: z.string().optional(),
});

export async function createFounder(req: AuthedRequest, res: Response) {
  const input = founderSchema.parse(req.body);
  const result = await createFounderForUser(req.user!.id, input);
  res.status(result.duplicateFound ? 200 : 201).json(result);
}

export async function getFounders(req: AuthedRequest, res: Response) {
  res.json(await listFounders(req.user!.id, req.query as Record<string, string | undefined>));
}

export async function getFounder(req: AuthedRequest, res: Response) {
  const founder = await getFounderById(req.params.id, req.user!.id);
  if (!founder) throw new AppError("Founder not found", 404);
  res.json(founder);
}

export async function patchFounder(req: AuthedRequest, res: Response) {
  res.json(await updateFounder(req.params.id, req.body));
}

export async function removeFounder(req: AuthedRequest, res: Response) {
  await deleteFounder(req.params.id);
  res.status(204).send();
}
