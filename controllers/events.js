import Event from "../models/event.js";
import moment from "moment";

export const reportEvent = async (
  establishment,
  type,
  startDate,
  createdBy,
  doctor,
  appointment,
  motif
) => {
  try {
    await new Event({
      establishment: establishment,
      type: type,
      startDate: startDate,
      createdBy: createdBy,
      doctor: doctor,
      appointment: appointment,
      motif: motif,
    }).save();
  } catch (e) {
    console.error(`Event saving error: ${e.message}`);
  }
};

export const fetchEvents = async (req, res) => {
  const limit = 20;
  const query = {
    establishment: req.params.id,
    startDate: {
      $gte: req.body.startDate,
      $lte: moment(req.body.endDate).add(1, "day").format("yyyy-MM-DD"),
    },
  };
  if (req.body.doctorId !== null) query.doctor = req.body.doctorId;
  try {
    const events = await Event.find(query)
      .populate({
        path: "appointment",
        populate: { path: "reservation", populate: { path: "type" } },
      })
      .populate({
        path: "appointment",
        populate: {
          path: "patient doctor",
          populate: { path: "user", select: "-password -avatar" },
        },
      })
      .populate({
        path: "createdBy",
        select: "-password -avatar",
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(req.body.page * limit);

    const docs = await Event.countDocuments(query);
    const count = Math.ceil(docs / limit);

    res.status(200).json({ events: events, count: count });
  } catch (error) {
    console.log(error);
    res.status(401).json(error);
  }
};
