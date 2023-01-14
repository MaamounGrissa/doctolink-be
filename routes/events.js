import express from "express";
import { fetchEvents } from "../controllers/events.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/event/getbyest/:id", auth, fetchEvents);
export default router;
