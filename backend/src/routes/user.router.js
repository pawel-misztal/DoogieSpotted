import { Router } from "express";
import { getUser, login, logout, register } from "../controllers/user.controller.js";

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/', getUser);

export default router;