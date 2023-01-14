import Calendar from "../models/calendar.js";
import Reservation from "../models/reservation.js";
import Appointment from "../models/appointment.js";
import moment from "moment";
moment.locale("fr");

export const getConfigured = async (req, res) => {
  try {
    const calendar = await Calendar.findOne({ doctor: req.params.id });
    if (calendar) {
      res
        .status(200)
        .json({ startDate: calendar.startDate, endDate: calendar.endDate });
    } else {
      res.status(200).json({});
    }
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};

export const getByDoctor = async (req, res) => {
  try {
    const calendar = await Calendar.findOne({ doctor: req.params.id })
      .populate({
        path: "spots",
        match: {
          startDate: { $gte: req.body.startDate },
          endDate: { $lte: req.body.endDate },
        },
        populate: { path: "type" },
      })
      .populate({
        path: "doctor",
        populate: { path: "establishment user", select: "-password" },
      });
    if (calendar) {
      const appointments = await Appointment.find({
        calendar: calendar._id,
        status: { $ne: "CANCELED" },
      })
        .populate({
          path: "reservation",
          match: {
            startDate: { $gte: req.body.startDate },
            endDate: { $lte: req.body.endDate },
          },
          populate: { path: "type" },
        })
        .populate({
          path: "patient",
          populate: { path: "user", select: "-password" },
        });
      res.status(200).json({
        calendar: calendar,
        appointments: appointments,
      });
    } else {
      res.status(200).json({ calendar: [], appointments: [] });
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

export const getFreeBydoctor = async (req, res) => {
  try {
    const calendar = await Calendar.findOne({ doctor: req.params.id }).populate(
      {
        path: "spots",
        match: {
          startDate: { $gte: req.body.startDate },
          endDate: { $lte: req.body.endDate },
          status: "FREE",
        },
        populate: { path: "type" },
      }
    );
    if (calendar) {
      res.status(200).json(calendar);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

export const stamp = async (req, res) => {
  const data = req.body;
  const table = data.template.table;

  const startMoment = moment(data.startDate);
  const endMoment = moment(data.endDate).add(1, "day");
  var reservations = [];

  const createReservations = async (startMoment, endMoment, reservations) => {
    do {
      for (var i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].days.length; j++) {
          if (table[i].days[j].dayIndex + 1 === startMoment.isoWeekday()) {
            for (let k = 0; k < table[i].days[j].cells.length; k++) {
              if (table[i].days[j].cells[k].Qty) {
                for (let l = 0; l < table[i].days[j].cells[k].Qty; l++) {
                  const res = await Reservation.create({
                    startDate:
                      startMoment.format("yyyy-MM-DD") +
                      "T" +
                      table[i].days[j].cells[k].start,
                    endDate:
                      startMoment.format("yyyy-MM-DD") +
                      "T" +
                      table[i].days[j].cells[k].end,
                    type: table[i].days[j].cells[k].type,
                  });
                  reservations.push(res._id);
                }
              }
            }
          }
        }
      }
      startMoment.add(1, "day");
    } while (startMoment.isBefore(endMoment, "day"));
    return reservations;
  };

  try {
    const exists = await Calendar.findOne({ doctor: data.doctorId });
    if (exists) {
      exists.startDate > data.startDate
        ? (exists.startDate = moment(data.startDate).format("yyyy-MM-DD"))
        : null;
      exists.endDate < data.endDate
        ? (exists.endDate = moment(data.endDate).format("yyyy-MM-DD"))
        : null;
      await createReservations(startMoment, endMoment, reservations);
      exists.spots = [...exists.spots, ...reservations];
      await exists.save();
    } else {
      await createReservations(startMoment, endMoment, reservations);
      await Calendar.create({
        doctor: data.doctorId,
        startDate: moment(data.startDate).format("yyyy-MM-DD"),
        endDate: moment(data.endDate).format("yyyy-MM-DD"),
        spots: reservations,
        weekend: data.weekend,
        startDayHour: data.startDayHour,
        endDayHour: data.endDayHour,
        cellDuration: data.template.duration,
      });
    }
    res
      .status(200)
      .json({ message: "Doctor calendar configured successfully." });
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};
