import Appointment from "../models/appointment.js";
import Demand from "../models/demand.js";
import moment from "moment";
moment.locale("fr");

export const getByEstablishmentPeriod = async (req, res) => {
  const query = {
    establishment: req.params.id,
    startDate: {
      $gte: req.body.startDate,
      $lte: moment(req.body.endDate).add(1, "day").format("yyyy-MM-DD"),
    },
    status: { $ne: "CANCELED" },
  };
  if (req.body.doctorId) query.doctor = req.body.doctorId;
  try {
    const appointments = await Appointment.find(query)
      .populate({
        path: "patient",
        populate: { path: "user", select: "-avatar -password" },
      })
      .populate({ path: "reservation", populate: { path: "type" } })
      .sort({ startDate: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

export const getDemandsCount = async (req, res) => {
  const query = { establishment: req.params.id };
  if (req.body.doctorId !== null) query.doctor = req.body.doctorId;
  var demands = await Demand.find(query);
  var count = demands.length;
  res.status(200).json(count);
};

export const getCancelsCount = async (req, res) => {
  const query = {
    establishment: req.params.id,
    cancelDemand: true,
  };
  if (req.body.doctorId) query.doctor = req.body.doctorId;
  var demands = await Appointment.find(query);
  var count = demands.length;
  res.status(200).json(count);
};
