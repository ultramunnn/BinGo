import { Response, NextFunction } from "express";
import * as ClassificationService from "../services/classification.service";
import * as ClassificationModel from "../models/classification.model";
import { AuthRequest } from "../types/auth";
import type { QuestionnaireInput } from "../types/classification";

const QUESTIONNAIRE_FIELDS = [
  "is_hard", "is_multilayer", "is_dry", "is_clean",
  "is_container", "is_fragment", "is_hazardous", "is_foam", "is_small_item",
] as const;

function parseBool(val: unknown): boolean | undefined {
  if (val === undefined || val === null || val === "") return undefined;
  if (val === "true" || val === true || val === "1" || val === 1) return true;
  if (val === "false" || val === false || val === "0" || val === 0) return false;
  return undefined;
}

export const scan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  const { latitude, longitude, location_name } = req.body;
  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "latitude and longitude are required" });
  }

  // Parse questionnaire (fields are optional per category)
  const questionnaire: QuestionnaireInput = {};
  for (const field of QUESTIONNAIRE_FIELDS) {
    const parsed = parseBool(req.body[field]);
    if (parsed !== undefined) {
      questionnaire[field] = parsed;
    }
  }

  const result = await ClassificationService.scan(
    req.user!.id,
    file.buffer,
    file.mimetype,
    parseFloat(latitude),
    parseFloat(longitude),
    questionnaire,
    location_name
  );

  res.status(201).json({ success: true, message: "Scan completed", data: result });
};

export const getScan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const record = await ClassificationModel.findById(req.params.id as string);
  if (!record) {
    return res.status(404).json({ error: "Scan not found" });
  }
  res.json({ success: true, data: record });
};

export const getMyScans = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { page, limit } = parsePagination(req.query);
  const result = await ClassificationModel.findByUserId(req.user!.id, page, limit);
  res.json({ success: true, data: result.data, pagination: { page, limit, total: result.total } });
};

export const getAllScans = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { page, limit } = parsePagination(req.query);
  const result = await ClassificationModel.findAll(page, limit);
  res.json({ success: true, data: result.data, pagination: { page, limit, total: result.total } });
};

export const deleteScan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const deleted = await ClassificationModel.remove(req.params.id as string, req.user!.id);
  if (!deleted) {
    return res.status(404).json({ error: "Scan not found or not authorized" });
  }
  res.json({ success: true, message: "Scan deleted" });
};

function parsePagination(query: any): { page: number; limit: number } {
  return {
    page: parseInt(query.page) || 1,
    limit: parseInt(query.limit) || 20,
  };
}
