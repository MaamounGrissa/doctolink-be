import Doctor from "../models/doctor.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const add = async (req, res) => {
  const { name, email, specialty, phone, password, role, establishment } =
    req.body;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists)
    return res
      .status(500)
      .json({ message: "il y a un utilisateur avec cette adresse email !" });
  try {
    User.create(
      {
        name,
        email,
        phone,
        password: bcrypt.hashSync(password, 12),
        role,
      },
      (err, user) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Something went wrong !" });
        } else {
          Doctor.create({
            user: user._id,
            specialty,
            establishment: establishment,
          });
          res.json({
            message: "Doctor Added successfully.",
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const get = async (req, res) => {
  const doctors = await Doctor.find({});
  res.status(200).send(doctors);
};

export const getAll = async (req, res) => {
  const doctors = await Doctor.find({ establishment: req.params.id }).populate({
    path: "user",
    select: "-avatar -password",
  });
  res.status(200).send(doctors);
};

export const getById = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  doctor ? res.status(200).send(doctor) : res.status(403).send("NOT FOUND");
};

export const modify = async (req, res) => {
  const { doctorId, _id, name, email, phone, password } = req.body;
  try {
    const user = await User.findById(_id);
    const emailExists = await User.findOne({
      _id: { $ne: _id },
      email: email.toLowerCase(),
    });
    const doctor = await Doctor.findById(doctorId);
    if (emailExists) {
      return res.status(403).json({ message: "email is already used !" });
    }
    password ? (user.password = bcrypt.hashSync(password, 12)) : null;
    user.name = name;
    user.email = email;
    user.phone = phone;
    doctor ? doctor.save() : null;
    user.save();
    res.status(200).json({
      message: "Doctor Modified successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
    console.log(error);
  }
};

export const remove = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.memberId);
    await User.findByIdAndDelete(req.params.userId);
    res.json({
      message: "Doctor Removed successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
    console.log(error);
  }
};

export const block = async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.memberId, { isActive: false });
    res.json({
      message: "Doctor blocked successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
    console.log(error);
  }
};

export const activate = async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.memberId, { isActive: true });
    res.json({
      message: "Doctor activated successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
    console.log(error);
  }
};
