import express, { Request, Response, NextFunction } from "express";
import { config } from "./config/env";
import { ApiError } from "./utils/ApiError";
import userRoutes from "./modules/users/user.routes";

const app = express();

app.use(express.json());

// Маршруты
app.use("/users", userRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Глобальный обработчик ошибок
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const errorIsApiError = err instanceof ApiError;
  console.error(err);

  return res.status(errorIsApiError ? err.statusCode : 500).json({
    success: false,
    message: errorIsApiError ? err.message : "Internal server error",
  });
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

export default app;
