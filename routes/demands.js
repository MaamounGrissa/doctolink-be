import express from "express";
import {
  add,
  cancel,
  getByPatient,
  getByEstPeriod,
} from "../controllers/demands.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/demand/add/:establishment", auth, add);
router.post("/demands/getdemandsbyestperiod/:id", auth, getByEstPeriod);

router.get("/demand/get/:id", auth, getByPatient);
router.delete("/demand/cancel/:id", auth, cancel);

export default router;
