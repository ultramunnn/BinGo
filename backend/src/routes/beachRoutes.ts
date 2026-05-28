import { Router, Request, Response, NextFunction } from "express";
import {
  getBeaches,
  getBeachDetail,
  submitReview,
  deleteReview,
} from "../controllers/beachController";
import { authenticate } from "../middleware/auth";
import { uploadPhoto } from "../middleware/upload";

const router = Router();

const wrap =
  <Req extends Request>(
    fn: (req: Req, res: Response, next: NextFunction) => Promise<any>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req as Req, res, next).catch(next);
  };

// Public
router.get("/", wrap(getBeaches));
router.get("/:id", wrap(getBeachDetail));

// Protected
router.post("/:id/reviews", authenticate, uploadPhoto, wrap(submitReview));
router.delete("/:id/reviews", authenticate, wrap(deleteReview));

export default router;
