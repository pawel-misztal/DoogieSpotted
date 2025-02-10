import { Router } from "express";
import {
    getUser,
    login,
    logout,
    register,
    resetPassword,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/resetPassword", resetPassword);
router.post("/logout", logout);
router.get("/", getUser);

export default router;
