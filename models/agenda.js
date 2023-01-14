import mongoose from "mongoose";

const agendaSchema = mongoose.Schema(
  {
    name: String,
    types: [{ type: mongoose.Schema.Types.ObjectId, ref: "Type" }],
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Establishment",
    },
    template: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

var Agenda = mongoose.model("Agenda", agendaSchema);

export default Agenda;
