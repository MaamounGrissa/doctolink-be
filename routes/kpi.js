import express from "express";
import {
  getByEstablishmentPeriod,
  getCancelsCount,
  getDemandsCount,
} from "../controllers/kpi.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/kpi/getappointments/:id", auth, getByEstablishmentPeriod);
router.post("/kpi/getdemandscount/:id", auth, getDemandsCount);
router.post("/kpi/getcancelscount/:id", auth, getCancelsCount);

export default router;
