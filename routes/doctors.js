import express from "express";
import {
  add,
  get,
  getById,
  modify,
  remove,
  block,
  activate,
  getAll,
} from "../controllers/doctors.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/doctor/add", auth, add);
router.get("/doctor/get", auth, get);
router.get("/doctor/getAll/:id", auth, getAll);
router.post("/doctor/:id", auth, getById);
router.put("/doctor", auth, modify);
router.delete("/doctor/:memberId/:userId", auth, remove);
router.put("/doctor/block/:memberId", auth, block);
router.put("/doctor/activate/:memberId", auth, activate);

export default router;
