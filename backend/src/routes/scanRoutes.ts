import { Router, Request, Response, NextFunction } from "express";
import {
<<<<<<< HEAD
=======
  preClassify,
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
  scan,
  getScan,
  getMyScans,
  getAllScans,
  deleteScan,
<<<<<<< HEAD
=======
  getQuestionnaire,
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
} from "../controllers/classificationController";
import { authenticate } from "../middleware/auth";
import { uploadPhoto as uploadMiddleware } from "../middleware/upload";

const router = Router();

const wrap = <Req extends Request>(fn: (req: Req, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req as Req, res, next).catch(next);
  };

<<<<<<< HEAD
// Protected: upload image + GPS for classification
=======
// Protected: pre-classify image (CV only, returns category + confidence)
router.post("/classify", authenticate, uploadMiddleware, wrap(preClassify));

// Public: get dynamic questionnaire for a material category
router.get("/questionnaire", wrap(getQuestionnaire));

// Protected: full scan (image + GPS + questionnaire → orchestrator)
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
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