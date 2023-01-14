import express from "express";
import {
  add,
  get,
  getById,
  modify,
  remove,
  block,
  activate,
} from "../controllers/admins.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/admin/add", auth, add);
router.get("/admin/get", auth, get);
router.post("/admin/:id", auth, getById);
router.put("/admin", auth, modify);
router.delete("/admin/:memberId/:userId", auth, remove);
router.put("/admin/block/:memberId", auth, block);
router.put("/admin/activate/:memberId", auth, activate);

export default router;
