import Type from "../models/type.js";
import Agenda from "../models/agenda.js";

export const getByAgenda = async (req, res) => {
  var agenda = await Agenda.findById(req.params.id).populate("types");
  var types = agenda.types.map((type) => {
    return { ...type._doc, id: type._id, text: type.name };
  });
  res.status(200).json(types);
};

export const getByEst = async (req, res) => {
  var types = await Type.find({ establishment: req.params.id });
  types = types.map((type) => {
    return { ...type._doc, id: type._id, text: type.name };
  });
  res.status(200).json(types);
};

export const remove = async (req, res) => {
  try {
    await Type.findByIdAndDelete(req.params.id);
    res.json({
      message: "Type Removed successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const modify = async (req, res) => {
  const data = req.body;
  try {
    const type = await Type.findById(data._id);
    type.color = data.color;
    type.name = data.name;
    type.duration = data.duration;
    type.online = data.online;
    await type.save();
    res.status(200).json({ message: "Type modified successfully" });
  } catch (error) {
    res.status(401).json({ message: "An error occured !" });
  }
};
