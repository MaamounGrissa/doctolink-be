import express from "express";
import {
  add,
  get,
  getForPatient,
  getById,
  modify,
  getMembers,
  getByEst,
  search,
} from "../controllers/establishments.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/establishment/add", auth, add);
router.get("/establishment/get", auth, get);
router.post("/establishment/getforpatient", auth, getForPatient);
router.post("/establishment/:id", auth, getById);
router.put("/establishment/:id", auth, modify);
router.post("/establishment/members/:id", auth, getMembers);
router.post("/establishments/getbyest/:id", getByEst);
router.post("/establishments/search", search);

export default router;
