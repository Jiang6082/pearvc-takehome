import { Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { AuthedRequest } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";

export async function createNote(req: AuthedRequest, res: Response) {
  const input = z.object({ founderId: z.string().uuid(), body: z.string().min(1) }).parse(req.body);
  const note = await prisma.sharedNote.create({
    data: { founderId: input.founderId, body: input.body, authorId: req.user!.id },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
  res.status(201).json(note);
}

export async function patchNote(req: AuthedRequest, res: Response) {
  const input = z.object({ body: z.string().min(1) }).parse(req.body);
  const note = await prisma.sharedNote.findUnique({ where: { id: req.params.id } });
  if (!note) throw new AppError("Note not found", 404);
  if (note.authorId !== req.user!.id) throw new AppError("Only the author can edit this note", 403);
  res.json(await prisma.sharedNote.update({ where: { id: req.params.id }, data: input }));
}

export async function removeNote(req: AuthedRequest, res: Response) {
  const note = await prisma.sharedNote.findUnique({ where: { id: req.params.id } });
  if (!note) throw new AppError("Note not found", 404);
  if (note.authorId !== req.user!.id) throw new AppError("Only the author can delete this note", 403);
  await prisma.sharedNote.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
