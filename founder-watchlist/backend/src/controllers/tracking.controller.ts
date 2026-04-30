import { Response } from "express";
import { z } from "zod";
import { AuthedRequest } from "../middleware/auth.js";
import { deleteTracking, listMyTracking, markContacted, trackFounder, updateTracking } from "../services/tracking.service.js";

const trackingSchema = z.object({
  founderId: z.string().uuid(),
  status: z.enum(["WATCHING", "WARM", "ACTIVE", "PASSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  privateNotes: z.string().optional(),
  isOwner: z.boolean().optional(),
});

export async function createTracking(req: AuthedRequest, res: Response) {
  res.status(201).json(await trackFounder(req.user!.id, trackingSchema.parse(req.body)));
}

export async function getMyTracking(req: AuthedRequest, res: Response) {
  res.json(await listMyTracking(req.user!.id));
}

export async function patchTracking(req: AuthedRequest, res: Response) {
  const schema = trackingSchema.omit({ founderId: true }).extend({
    privateNotes: z.string().nullable().optional(),
    lastContactedAt: z.string().datetime().nullable().optional(),
  });
  const input = schema.parse(req.body);
  const lastContactedAt =
    typeof input.lastContactedAt === "string"
      ? new Date(input.lastContactedAt)
      : input.lastContactedAt;
  res.json(await updateTracking(req.user!.id, req.params.id, {
    ...input,
    lastContactedAt,
  }));
}

export async function removeTracking(req: AuthedRequest, res: Response) {
  await deleteTracking(req.user!.id, req.params.id);
  res.status(204).send();
}

export async function postMarkContacted(req: AuthedRequest, res: Response) {
  res.json(await markContacted(req.user!.id, req.params.id));
}
