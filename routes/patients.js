import express from "express";
import {
  get,
  create,
  modify,
  getAll,
  block,
  activate,
} from "../controllers/patients.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/patient/get/:id", auth, get);
router.get("/patient/getAll/:id", auth, getAll);
router.post("/patient/create", auth, create);
router.put("/patient/modify/:id", auth, modify);
router.put("/patient/block/:id", auth, block);
router.put("/patient/activate/:id", auth, activate);

export default router;
