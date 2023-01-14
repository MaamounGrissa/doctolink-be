import Agenda from "../models/agenda.js";
import Template from "../models/template.js";
import Type from "../models/type.js";
import mongoose from "mongoose";

export const getByEst = async (req, res) => {
  const agendas = await Agenda.find({ establishment: req.params.id })
    .populate("types")
    .populate("establishment")
    .populate("template");
  res.status(200).json(agendas);
};

export const getActiveByEst = async (req, res) => {
  const agendas = await Agenda.find({
    establishment: req.params.id,
    isActive: true,
  })
    .populate("types")
    .populate("establishment")
    .populate("template");
  res.status(200).json(agendas);
};

export const add = async (req, res) => {
  var data = req.body;
  var typeRefs = [];
  try {
    for (let i = 0; i < data.types.length; i++) {
      const typeExist = await Type.find({
        name: data.types[i].text.toUpperCase(),
        establishment: data.establishment,
      });
      if (typeExist.length === 0) {
        const newType = await Type.create({
          name: data.types[i].text.toUpperCase(),
          establishment: data.establishment,
        });
        typeRefs = [...typeRefs, newType._id];
      } else {
        typeRefs = [...typeRefs, data.types[i]._id];
      }
    }
    await Agenda.create({ ...data, types: typeRefs });
    res.status(200).json({ message: "Agenda created successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "An error occured !" });
  }
};

export const modify = async (req, res) => {
  var data = req.body;
  var typeRefs = [];
  try {
    for (let i = 0; i < data.types.length; i++) {
      const typeExist = await Type.find({
        name: data.types[i].text.toUpperCase(),
        establishment: data.establishment,
      });
      if (typeExist.length === 0) {
        const newType = await Type.create({
          name: data.types[i].text.toUpperCase(),
          establishment: data.establishment,
        });
        typeRefs = [...typeRefs, newType._id];
      } else {
        typeRefs = [...typeRefs, data.types[i]._id];
      }
    }

    const agenda = await Agenda.findById(data._id);
    agenda.name = data.name;
    agenda.types = typeRefs;
    agenda.save();

    res.status(200).json({ message: "Agenda modified successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "An error occured !" });
  }
};

export const remove = async (req, res) => {
  try {
    await Agenda.findByIdAndDelete(req.params.id);
    res.json({
      message: "Agenda Removed successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const block = async (req, res) => {
  try {
    await Agenda.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({
      message: "Agenda blocked successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const activate = async (req, res) => {
  try {
    await Agenda.findByIdAndUpdate(req.params.id, { isActive: true });
    res.json({
      message: "Agenda activated successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const config = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const table = data.table;
  const valid = mongoose.Types.ObjectId.isValid(data.tempId);

  try {
    if (valid) {
      var exists = await Template.findById(data.tempId);
    }
    if (exists) {
      exists.duration = data.duration;
      exists.table = table;
      await exists.save();
      res.status(200).json({
        message: "Agenda configured successfully.",
      });
    } else {
      const template = await Template.create({
        duration: data.duration,
        table: table,
      });
      await Agenda.findByIdAndUpdate(id, { template: template._id });
      res.status(200).json({
        message: "Agenda configured successfully.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong !" });
  }
};
