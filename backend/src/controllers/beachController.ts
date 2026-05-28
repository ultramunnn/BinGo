import { Response } from "express";
import * as BeachService from "../services/beach.service";
import type { AuthRequest } from "../types/auth";

export async function getBeaches(req: AuthRequest, res: Response) {
  const forceRefresh = req.query.refresh === "true";
  const beaches = await BeachService.getAllBeaches(forceRefresh);
  res.json({ success: true, data: beaches });
}

export async function getBeachDetail(req: AuthRequest, res: Response) {
  const detail = await BeachService.getBeachDetail(req.params.id as string);
  res.json({ success: true, data: detail });
}

export async function submitReview(req: AuthRequest, res: Response) {
  const { rating, message } = req.body;
  const file = (req as any).file;
  const review = await BeachService.submitReview(
    req.params.id as string,
    req.user!.id,
    rating,
    message,
    file?.buffer,
    file?.mimetype
  );
  res.status(201).json({ success: true, data: review });
}

export async function deleteReview(req: AuthRequest, res: Response) {
  await BeachService.deleteReview(req.params.id as string, req.user!.id);
  res.json({ success: true, message: "Review berhasil dihapus" });
}
