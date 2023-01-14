import express from "express";
import {
  sendMessage,
  getRooms,
  getRoom,
  unreadCount,
  getRoomsPatient,
  getRoomPatient,
  unreadCountPatient,
} from "../controllers/messenger.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/messenger/sendmessage", auth, sendMessage);
router.get("/messenger/getroomsbyest/:id", auth, getRooms);
router.get("/messenger/getroom/:id", auth, getRoom);
router.get("/messenger/getunread/:id", auth, unreadCount);
router.get("/messenger/getroomsbypatient/:id", auth, getRoomsPatient);
router.get("/messenger/getroompatient/:id", auth, getRoomPatient);
router.get("/messenger/getunreadpatient/:id", auth, unreadCountPatient);

export default router;
