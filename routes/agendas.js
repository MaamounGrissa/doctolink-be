import express from "express";
import {
  getByEst,
  getActiveByEst,
  add,
  modify,
  remove,
  block,
  activate,
  config,
} from "../controllers/agendas.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/agenda/getbyest/:id", auth, getByEst);
router.post("/agenda/getactivebyest/:id", auth, getActiveByEst);
router.post("/agenda/config/:id", auth, config);
router.post("/agenda/add", auth, add);
router.put("/agenda/modify", auth, modify);
router.put("/agenda/block/:id", auth, block);
router.put("/agenda/activate/:id", auth, activate);
router.delete("/agenda/remove/:id", auth, remove);

export default router;
