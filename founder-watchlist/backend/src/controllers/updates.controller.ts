import { Response } from "express";
import { z } from "zod";
import { AuthedRequest } from "../middleware/auth.js";
import { createManualUpdate, listUpdates, updateSignal } from "../services/updates.service.js";
import { runMockIngestion } from "../services/mockIngestion.service.js";

const updateSchema = z.object({
  founderId: z.string().uuid(),
  signalType: z.enum(["JOB_CHANGE", "COMPANY_STARTED", "PRODUCT_LAUNCH", "FUNDRAISING", "HIRING", "COFOUNDER_SEARCH", "SOCIAL_TRACTION", "COMPANY_PIVOT", "MANUAL"]).optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
});

export async function getUpdates(req: AuthedRequest, res: Response) {
  res.json(await listUpdates(req.user!.id, req.query as Record<string, string | undefined>));
}

export async function postUpdate(req: AuthedRequest, res: Response) {
  res.status(201).json(await createManualUpdate(updateSchema.parse(req.body)));
}

export async function patchUpdate(req: AuthedRequest, res: Response) {
  const input = z.object({
    isImportant: z.boolean().optional(),
    isDismissed: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  }).parse(req.body);
  res.json(await updateSignal(req.params.id, input));
}

export async function mockIngest(_req: AuthedRequest, res: Response) {
  res.status(201).json({ created: await runMockIngestion() });
}
