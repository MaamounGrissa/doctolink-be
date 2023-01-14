import express from "express";
import {
  getConfigured,
  stamp,
  getByDoctor,
  getFreeBydoctor,
} from "../controllers/calendars.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/calendar/getconfigured/:id", auth, getConfigured);
router.post("/calendar/getbydoctor/:id", getByDoctor);
router.post("/calendar/stamp", auth, stamp);
router.post("/calendar/getfreebydoctor/:id", getFreeBydoctor);

export default router;
