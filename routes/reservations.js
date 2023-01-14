import express from "express";
import { remove, modify, add } from "../controllers/reservations.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.delete("/reservation/remove/:id", auth, remove);
router.put("/reservation/modify", auth, modify);
router.put("/reservation/add", auth, add);

export default router;
