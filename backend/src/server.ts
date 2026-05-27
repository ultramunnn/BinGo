import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import scanRoutes from "./routes/scanRoutes";
import { setupSwagger } from "./config/swagger";
import { AuthError } from "./services/auth.service";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    docs: "http://localhost:3000/api-docs",
  });
});

// Global error handler — replaces per-endpoint try/catch
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Multer errors
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ error: err.message });
  }
  if ("code" in err && (err as any).code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File size must be under 5MB" });
  }

  console.error("[ERROR]", err.stack || err.message);
  res.status(500).json({ error: err.message || "Internal server error", stack: err.stack?.split("\n").slice(0, 5) });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});
