import { Router } from "express";
import * as UserController from "./user.controller";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { validateRegister, validateLogin } from "./user.dto";

const router = Router();

// Публичные маршруты
router.post("/register", validate(validateRegister), UserController.register);
router.post("/login", validate(validateLogin), UserController.login);

// Защищённые маршруты
router.get("/", authenticate, requireAdmin, UserController.getAll);
router.get("/:id", authenticate, UserController.getById);
router.patch("/:id/block", authenticate, UserController.block);

export default router;
