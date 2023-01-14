import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Admin from "../models/admin.js";
import Doctor from "../models/doctor.js";
import jwt from "jsonwebtoken";
import Patient from "../models/patient.js";

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id, "-password");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ data: users });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }, { password: 0 });
    res.status(201).json(admins);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    res.json({ message: "User Added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
    console.log(error);
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, avatar, password, role } = req.body;
  try {
    const oldUser = await User.findById(id);
    if (oldUser) {
      oldUser.name = name ? name : oldUser.name;
      oldUser.email = email ? email : oldUser.email;
      oldUser.phone = phone ? phone : oldUser.phone;
      oldUser.avatar = avatar ? avatar : oldUser.avatar;
      oldUser.role = role ? role : oldUser.role;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        oldUser.password = hashedPassword;
      } else {
        oldUser.password = oldUser.password;
      }
      await oldUser.save();
      const user = await User.findById(id, "-password");
      res.status(201).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, avatar, password, role } = req.body;
  try {
    const oldUser = await User.findById(id);
    if (oldUser) {
      oldUser.name = name ? name : oldUser.name;
      oldUser.email = email ? email : oldUser.email;
      oldUser.phone = phone ? phone : oldUser.phone;
      oldUser.avatar = avatar ? avatar : oldUser.avatar;
      oldUser.role = role ? role : oldUser.role;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        oldUser.password = hashedPassword;
      } else {
        oldUser.password = oldUser.password;
      }
      await oldUser.save();
      var adminInfo = {};
      var doctorInfo = {};
      var patientInfo = {};
      if (oldUser.role === "ADMIN") {
        adminInfo = await Admin.find({ user: oldUser._id }).select("-user");
      } else if (oldUser.role === "DOCTOR") {
        doctorInfo = await Doctor.find({ user: oldUser._id }).select("-user");
      } else if (oldUser.role === "PATIENT") {
        patientInfo = await Patient.find({ user: oldUser._id }).select("-user");
      }
      const token = jwt.sign(
        {
          id: oldUser._id,
          name: oldUser.name,
          email: oldUser.email,
          phone: oldUser.phone,
          role: oldUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.status(200).json({
        id: oldUser._id,
        name: oldUser.name,
        email: oldUser.email,
        phone: oldUser.phone,
        role: oldUser.role,
        avatar: oldUser.avatar,
        token: token,
        ...adminInfo[0]?._doc,
        ...doctorInfo[0]?._doc,
        ...patientInfo[0]?._doc,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndRemove(id);
  res.status(201).send(`User Deleted`);
};
