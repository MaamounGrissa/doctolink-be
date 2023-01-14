import mongoose from "mongoose";

const calendarSchema = mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    startDate: String,
    endDate: String,
    spots: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }],
    weekend: [Number],
    startDayHour: String,
    endDayHour: String,
    cellDuration: Number,
  },
  { timestamps: true }
);

var Calendar = mongoose.model("Calendar", calendarSchema);

export default Calendar;
