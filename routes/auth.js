import express from "express";
import {
  register,
  login,
  forgotPassword,
  checkResetToken,
  resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/checkresettoken", checkResetToken);
router.put("/resetpassword", resetPassword);

export default router;
