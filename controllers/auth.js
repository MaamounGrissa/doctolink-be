import User from "../models/user.js";
import Admin from "../models/admin.js";
import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";
import bcrypt from "bcryptjs";
import { transporter, mailcss } from "../components/mailer.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Establishment from "../models/establishment.js";

export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    adress,
    postalCode,
    specialty,
    demandObject,
    password,
    role,
  } = req.body;
  const name = firstName + " " + lastName;

  if (role === "PATIENT") {
    try {
      const oldUser = await User.findOne({ email: email.toLowerCase() });
      if (oldUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        role,
      });
      const newPatient = await Patient.create({ user: newUser._id });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.status(200).json({
        message: "User Added successfully.",
        userInfo: {
          id: newUser._id,
          name: name,
          email: email,
          phone: phone,
          role: role,
          token: token,
          ...newPatient._doc,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong !" });
      console.log(error);
    }
  } else {
    try {
      transporter.sendMail({
        from: "Doctolink",
        to: "achref.creo.developer@gmail.com",
        subject: "New demand",
        text: `You got a new demand from ${name}`,
        html:
          `<div ` +
          mailcss.background +
          `><h1>Doctolink</h1>
              <div` +
          mailcss.body +
          `>
              <h3>New demand</h3>
              <br/>
              <h5>You got a new demand from: ${name}</h5>
              <h5>Object of demand: ${demandObject}</h5>
              <h5>Infos: 
              name: ${name}
              phone: ${phone}
              email: ${email}
              adress: ${adress}
              postalCode: ${postalCode}
              specialty: ${specialty}
              </h5>
              </div>
              </div>`,
      });
      res.json({ message: "Demand sent successfully." });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong !" });
      console.log(error);
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    const valid = await bcrypt.compare(password, exists.password);
    if (valid) {
      var adminInfo = {};
      var patientInfo = {};
      var doctorInfo = {};
      var establishment;
      if (exists.role === "ADMIN") {
        adminInfo = await Admin.find({ user: exists._id }).select("-user");
        establishment = await Establishment.findOne({
          _id: adminInfo[0].establishment,
        });
      }
      if (exists.role === "DOCTOR") {
        doctorInfo = await Doctor.find({ user: exists._id }).select("-user");
        establishment = await Establishment.findOne({
          _id: doctorInfo[0].establishment,
        });
      }
      if (exists.role === "PATIENT") {
        patientInfo = await Patient.find({ user: exists._id }).select("-user");
      }
      const token = jwt.sign({ id: exists._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.status(200).json({
        id: exists._id,
        name: exists.name,
        email: exists.email,
        phone: exists.phone,
        role: exists.role,
        avatar: exists.avatar,
        token: token,
        weekend: establishment?.weekend,
        ...adminInfo[0]?._doc,
        ...patientInfo[0]?._doc,
        ...doctorInfo[0]?._doc,
      });
    } else {
      res.status(400).json("Password incorrect!");
    }
  } else {
    res.status(400).json("Account not found !");
  }
};

export const forgotPassword = async (req, res) => {
  const email = req.body.email;
  const exists = await User.findOne({ email: email });
  const token = crypto.randomBytes(15).toString("hex");

  if (exists) {
    try {
      exists.token = token;
      exists.save();
      transporter.sendMail({
        from: "Doctolink",
        to: { email },
        subject: "Reset password",
        text: `follow instructions to recover your password`,
        html:
          `<div ` +
          mailcss.background +
          `><h1>Doctolink</h1>
              <div` +
          mailcss.body +
          `>
              <h3>Reset password</h3>
              <br/>
              <h5>Follow the link below to reset your password and recover your account</h5>
              <h5>Infos: 
              link: https://doctolink.com/reset-password/${email}/${token}
              </h5>
              </div>
              </div>`,
      });
      res.json({ message: "Demand sent successfully." });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong !" });
      console.log(error);
    }
  } else {
    res.status(404).json({ message: "account not found !" });
  }
};

export const checkResetToken = async (req, res) => {
  const data = req.body;
  try {
    const user = await User.findOne({ email: data.email, token: data.token });
    if (user) {
      res.status(200).json(user._id);
    } else {
      res.status(404).json({ message: "NOT-FOUND" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      const hashedPassword = await bcrypt.hash(password, 12);
      oldUser.password = hashedPassword;
      oldUser.token = "";
      await oldUser.save();
      res.status(201).json({ message: "Password changed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
