import express from "express";
import { getByEst, getByAgenda, modify, remove } from "../controllers/types.js";import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/type/getbyagenda/:id",auth,  getByAgenda);
router.post("/type/getbyest/:id",auth,  getByEst);
router.put("/type/modify",auth,  modify);
router.delete("/type/remove/:id",auth,  remove);

export default router;
