import Appointment from "../models/appointment.js";
import Reservation from "../models/reservation.js";
import Calendar from "../models/calendar.js";
import moment from "moment";
import { reportEvent } from "./events.js";
moment.locale("fr");
import { io } from "../server.js";

export const add = async (req, res) => {
  const data = req.body;
  try {
    const appointment = await Appointment.create({
      ...data,
      endDate: moment(data.startDate)
        .add(data.duration, "minutes")
        .format("yyyy-MM-DDThh:mm"),
    });
    // check if there is a demand and send message to patient
    await Reservation.findByIdAndUpdate(data.reservation, {
      status: "BOOKED",
      patient: data.patient,
    });
    reportEvent(
      data.establishment,
      "ADD",
      appointment.startDate,
      data.createdBy,
      data.doctor,
      appointment._id
    );
    res.status(200).json({ message: "rendez-vous crée avec succes" });
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

export const remove = async (req, res) => {
  const data = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, {
      status: "CANCELED",
    });
    await Reservation.findByIdAndUpdate(appointment.reservation, {
      status: "FREE",
      patient: "",
    });
    reportEvent(
      data.establishment,
      "CANCEL",
      appointment.startDate,
      data.createdBy,
      appointment.doctor,
      appointment._id,
      data.motif
    );
    res.status(200).json({ message: "rendez-vous annulé" });
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

export const getByCalendar = async (req, res) => {
  try {
    const appointments = await Appointment.find(req.params.id);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(401).json(error);
  }
};

export const getByPatientAndCalendar = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.params.patientId,
      calendar: req.params.calendarId,
    })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "-password -avatar" },
      })
      .populate("createdBy", "-password -avatar")
      .populate({ path: "reservation", populate: { path: "type" } });
    res.status(200).json(appointments);
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

export const getByDoctorPeriod = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.id,
      startDate: {
        $gte: req.body.startDate,
        $lte: moment(req.body.endDate).add(1, "day").format("yyyy-MM-DD"),
      },
    })
      .populate({
        path: "patient",
        populate: { path: "user", select: "-avatar -password" },
      })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "-avatar -password" },
      })
      .populate({
        path: "createdBy",
        select: "-avatar -password",
      })
      .populate({ path: "reservation", populate: { path: "type" } })
      .sort({ startDate: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

export const getByEstAndPatientPeriod = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      establishment: req.params.estId,
      patient: req.params.userId,
      startDate: {
        $gte: req.body.startDate,
        $lte: moment(req.body.endDate).add(1, "day").format("yyyy-MM-DD"),
      },
    })
      .populate({
        path: "patient",
        populate: { path: "user", select: "-avatar -password" },
      })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "-avatar -password" },
      })
      .populate({
        path: "createdBy",
        select: "-avatar -password",
      })
      .populate({ path: "reservation", populate: { path: "type" } })
      .sort({ startDate: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

export const modify = async (req, res) => {
  const data = req.body;
  try {
    const calendar = await Calendar.findById(data.calendar).populate("spots");
    const oldReservations = calendar.spots;
    const appointment = await Appointment.findById(data._id);
    const oldReservation = await Reservation.findById(data.reservation);
    if (
      (appointment.startDate != data.startDate &&
        (Math.abs(
          moment(data.startDate).diff(
            moment(oldReservation.startDate),
            "minutes"
          )
        ) >= calendar.cellDuration ||
          Math.abs(
            moment(data.startDate).diff(
              moment(oldReservation.endDate),
              "minutes"
            )
          ) >= calendar.cellDuration)) ||
      oldReservation.type != data.type
    ) {
      const newReservation = oldReservations.find(
        (reservation) =>
          moment(reservation.startDate) <= moment(data.startDate) &&
          moment(data.startDate) <
            moment(reservation.startDate).add(
              calendar.cellDuration,
              "minutes"
            ) &&
          reservation.type == data.type &&
          reservation.status === "FREE"
      );
      if (newReservation) {
        await Reservation.findByIdAndUpdate(data.reservation, {
          status: "FREE",
          patient: "",
        });
        // check if there is a demand and send message to patient
        await Reservation.findByIdAndUpdate(newReservation._id, {
          status: "BOOKED",
          patient: data.patient,
        });
        appointment.reservation = newReservation._id;
        appointment.startDate = data.startDate;
        appointment.endDate = moment(data.startDate).add(
          data.duration,
          "minutes"
        );
        appointment.patient = data.patient;
        appointment.status = data.status;
        appointment.notes = data.notes;
        await appointment.save();
        reportEvent(
          data.establishment,
          "POSPONE",
          appointment.startDate,
          data.createdBy,
          appointment.doctor,
          appointment._id
        );
        res.status(200).json({ message: "rendez-vous modifié avec succes" });
      } else {
        res.status(403).json({ message: "aucune réservation disponible" });
      }
    } else {
      appointment.startDate = data.startDate;
      appointment.endDate = moment(data.startDate).add(
        data.duration,
        "minutes"
      );
      appointment.patient = data.patient;
      oldReservation.patient = data.patient;
      appointment.status = data.status;
      appointment.notes = data.notes;
      await appointment.save();
      await oldReservation.save();
      reportEvent(
        data.establishment,
        "EDIT",
        appointment.startDate,
        data.createdBy,
        appointment.doctor,
        appointment._id
      );
      res.status(200).json({ message: "rendez-vous modifié avec succes" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

export const demandCancel = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id });
    appointment.cancelDemand = true;
    appointment.motif = req.body.motif;
    await appointment.save();
    io.to(appointment.establishment.toString()).emit("update-demands");
    res.status(200).json({ message: "demande d'annulation envoyée." });
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

export const cancel = async (req, res) => {
  try {
    req.body.appointments.forEach(async (appointment) => {
      await Appointment.findByIdAndUpdate(appointment._id, {
        status: "CANCELED",
      });
      await Reservation.findByIdAndUpdate(appointment.reservation, {
        status: "FREE",
        patient: "",
      });
      await reportEvent(
        req.body.establishment,
        "CANCEL",
        appointment.startDate,
        req.body.createdBy,
        appointment.doctor,
        appointment._id,
        req.body.motif
      );
    });
    res.status(200).json({ message: "rendez-vous annulée." });
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

export const getCancelsByDoctorPeriod = async (req, res) => {
  try {
    const cancels = await Appointment.find({
      doctor: req.params.id,
      cancelDemand: true,
      status: { $ne: "CANCELED" },
      startDate: {
        $gte: req.body.startDate,
        $lte: moment(req.body.endDate).add(1, "day").format("yyyy-MM-DD"),
      },
    })
      .populate({ path: "reservation", populate: { path: "type" } })
      .populate("calendar establishment")
      .populate({
        path: "patient",
        populate: { path: "user", select: "-avatar -password" },
      });
    res.status(200).json(cancels);
  } catch (error) {
    res.status(401).json(error);
  }
};
