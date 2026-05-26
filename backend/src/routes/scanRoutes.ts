import { Router, Request, Response, NextFunction } from "express";
import {
  scan,
  getScan,
  getMyScans,
  getAllScans,
  deleteScan,
} from "../controllers/classificationController";
import { authenticate } from "../middleware/auth";
import { uploadPhoto as uploadMiddleware } from "../middleware/upload";

const router = Router();

const wrap = <Req extends Request>(fn: (req: Req, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req as Req, res, next).catch(next);
  };

// Protected: upload image + GPS for classification
router.post("/", authenticate, uploadMiddleware, wrap(scan));

// Protected: get current user's scans
router.get("/me", authenticate, wrap(getMyScans));

// Public: get all scans (feed)
router.get("/", wrap(getAllScans));

// Public: get single scan by ID
router.get("/:id", wrap(getScan));

// Protected: delete own scan
router.delete("/:id", authenticate, wrap(deleteScan));

export default router;