import express from "express";
import {
  add,
  getByCalendar,
  getByPatientAndCalendar,
  getByDoctorPeriod,
  modify,
  remove,
  getByEstAndPatientPeriod,
  demandCancel,
  cancel,
  getCancelsByDoctorPeriod,
} from "../controllers/appointments.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/appointment/add", auth, add);
router.put("/appointment/modify", auth, modify);
router.get("/appointment/getbycalendar", auth, getByCalendar);
router.get(
  "/appointment/getbypatientandcalendar/:calendarId/:patientId",
  auth,
  getByPatientAndCalendar
);
router.post(
  `/appointment/getcancelsbydoctorperiod/:id`,
  auth,
  getCancelsByDoctorPeriod
);
router.post("/appointment/getbydoctorperiod/:id", auth, getByDoctorPeriod);
router.put("/appointment/remove/:id", auth, remove);
router.post(
  "/appointment/getbyestablishment/:userId/:estId",
  auth,
  getByEstAndPatientPeriod
);
router.put("/appointment/cancelDemand/:id", auth, demandCancel);
router.put("/appointment/cancel", auth, cancel);

export default router;
