import express from "express";
import {
  listUsers,
  getUser,
  getAdmins,
  addUser,
  editUser,
  deleteUser,
  editProfile,
} from "../controllers/users.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/listUsers", auth, listUsers);
router.get("/fetchUser/:id", auth, getUser);
router.get("/listAdmins", auth, getAdmins);
router.post("/addUser", auth, addUser);
router.post("/editUser/:id", auth, editUser);
router.post("/editProfile/:id", auth, editProfile);
router.delete("/:id", auth, deleteUser);

export default router;
