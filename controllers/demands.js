import Demand from "../models/demand.js";
import Patient from "../models/patient.js";
import Reservation from "../models/reservation.js";
import moment from "moment";
import { io } from "../server.js";

export const add = async (req, res) => {
  try {
    const exists = await Reservation.findOne({
      _id: req.body.reservation,
    }).populate("type");
    if (exists.status === "BOOKED" || !exists.type.online) {
      return res.status(403).json({ message: "rendez-vous non disponible !" });
    }
    await Demand.create({
      ...req.body,
      establishment: req.params.establishment,
    });
    const patient = await Patient.findById(req.body.patient);
    patient.establishments.includes(req.params.establishment)
      ? null
      : patient.establishments.push(req.params.establishment);
    await patient.save();
    io.to(req.params.establishment).emit("update-demands");
    res.status(200).json({ message: "demand success" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const getByPatient = async (req, res) => {
  var demands = await Demand.find({ patient: req.params.id });
  var data = [];
  for (let i = 0; i < demands.length; i++) {
    data.push(demands[i].reservation);
  }
  res.status(200).json(data);
};

export const cancel = async (req, res) => {
  try {
    await Demand.deleteOne({ reservation: req.params.id });
    res.status(200).json({ message: "demand deleted" });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getByEstPeriod = async (req, res) => {
  try {
    const cancels = await Demand.find({
      establishment: req.params.id,
      doctor: req.body.doctor,
    })
      .populate({
        path: "reservation",
        startDate: {
          $gte: req.body.startDate,
          $lte: moment(req.body.endDate).add(1, "day").format("yyyy-MM-DD"),
        },
        populate: { path: "type" },
      })
      .populate("calendar establishment")
      .populate({
        path: "patient",
        populate: { path: "user", select: "-avatar -password" },
      });
    res.status(200).json(cancels);
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};
