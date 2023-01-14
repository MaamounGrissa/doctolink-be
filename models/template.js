import mongoose from "mongoose";

const templateSchema = mongoose.Schema(
  {
    startDate: Date,
    endDate: Date,
    duration: Number,
    table: [
      {
        days: [
          {
            dayIndex: 0,
            cells: [],
          },
          {
            dayIndex: 1,
            cells: [],
          },
          {
            dayIndex: 2,
            cells: [],
          },
          {
            dayIndex: 3,
            cells: [],
          },
          {
            dayIndex: 4,
            cells: [],
          },
          {
            dayIndex: 5,
            cells: [],
          },
          {
            dayIndex: 6,
            cells: [],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

var Template = mongoose.model("Template", templateSchema);

export default Template;
