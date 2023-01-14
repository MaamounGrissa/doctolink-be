import Patient from "../models/patient.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const get = async (req, res) => {
  const patients = await Patient.find({
    establishments: req.params.id,
    blacklisted: { $nin: req.params.id },
  }).populate("user", "-password");
  res.status(200).json(patients);
};

export const getAll = async (req, res) => {
  const patients = await Patient.find({
    establishments: req.params.id,
  }).populate("user", "-password");
  res.status(200).json(patients);
};

export const create = async (req, res) => {
  const data = req.body;
  try {
    const oldUser = await User.findOne({ email: data.email.toLowerCase() });
    if (oldUser) {
      return res.status(400).json({ message: "Patient already exists" });
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const newUser = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      password: hashedPassword,
      role: "PATIENT",
    });
    const newPatient = await Patient.create({
      establishments: [data.establishment],
      user: newUser._id,
      ...data,
    });
    res.status(200).json({
      patient: {
        ...newPatient._doc,
        ...newUser._doc,
        id: newPatient._doc._id,
        label: newUser.name,
        password: "",
      },
      message: "patient added.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const modify = async (req, res) => {
  const data = req.body;
  const patientId = req.params.id;
  try {
    const patient = await Patient.findOne({ _id: patientId });
    const user = await User.findOne({ _id: data._id }).select("-password");
    data.sex && data.sex !== "" ? (patient.sex = data.sex) : null;
    data.birthday && data.birthday !== ""
      ? (patient.birthday = data.birthday)
      : null;
    data.name && data.name !== "" ? (user.name = data.name) : null;
    data.email && data.email !== "" ? (user.email = data.email) : null;
    data.phone && data.phone !== "" ? (user.phone = data.phone) : null;
    data.password && data.password !== ""
      ? (user.password = await bcrypt.hash(data.password, 12))
      : null;
    data.fixNumber && data.fixNumber !== ""
      ? (patient.fixNumber = data.fixNumber)
      : null;
    data.adress && data.adress !== "" ? (patient.adress = data.adress) : null;
    data.paymentCenter && data.paymentCenter !== ""
      ? (patient.paymentCenter = data.paymentCenter)
      : null;
    data.securityNumber && data.securityNumber !== ""
      ? (patient.securityNumber = data.securityNumber)
      : null;
    data.information && data.information !== ""
      ? (patient.information = data.information)
      : null;
    await patient.save();
    await user.save();

    res.status(200).json({
      patient: {
        ...patient._doc,
        user: { ...user._doc },
        id: patient._doc._id,
        label: user._doc.name,
      },
      message: "patient modified.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const block = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id });
    patient.blacklisted = [...patient.blacklisted, req.body.establishment];
    await patient.save();
    res.status(200).json({ message: "patient blocked." });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const activate = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id });
    patient.blacklisted = patient.blacklisted.filter(
      (x) => x !== req.body.establishment
    );
    await patient.save();
    res.status(200).json({ message: "patient activated." });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
