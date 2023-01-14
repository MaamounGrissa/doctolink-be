import Reservation from "../models/reservation.js";
import Calendar from "../models/calendar.js";

export const remove = async (req, res) => {
  await Reservation.findByIdAndRemove(req.params.id);
  res.status(200).json({ message: "spot deleted" });
};

export const modify = async (req, res) => {
  const data = req.body;
  try {
    await Reservation.findByIdAndUpdate(data._id, { ...data });
    res.status(200).json({ message: "spot modified" });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const add = async (req, res) => {
  const data = req.body;
  var newSpots = [];
  try {
    const calendar = await Calendar.findById(data.calendarId);
    if (calendar) {
      for (let i = 0; i < data.Qty; i++) {
        const spot = await Reservation.create(data);
        newSpots = [...newSpots, spot._id];
      }
      calendar.spots = [...calendar.spots, ...newSpots];
      await calendar.save();
      res.status(200).json({ message: "cellules added", calendar: calendar });
    }
  } catch (error) {
    res.status(401).json(error);
  }
};
