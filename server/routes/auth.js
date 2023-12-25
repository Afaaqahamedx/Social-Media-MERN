import express from "express";
import { login } from "../controllers/auth.js";

// auth.js for registering and logging in the user

const router = express.Router();

router.post("/login", login);

export default router;