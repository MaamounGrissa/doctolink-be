import Admin from "../models/admin.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const add = async (req, res) => {
  const { name, email, phone, password, role, establishment } = req.body;
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
          return res.status(500).json({ message: "Something went wrong !" });
        } else {
          Admin.create({
            user: user._id,
            establishment: establishment,
          });
          res.json({
            message: "Admin Added successfully.",
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const get = async (req, res) => {
  const admins = await Admin.find({});
  res.status(200).send(admins);
};

export const getById = async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  admin ? res.status(200).send(admin) : res.status(403).send("NOT FOUND");
};

export const modify = async (req, res) => {
  const { _id, name, email, phone, password } = req.body;
  try {
    const admin = await User.findById(_id);
    password ? (admin.password = bcrypt.hashSync(password, 12)) : null;
    admin.name = name;
    admin.email = email;
    admin.phone = phone;
    admin.save();
    res.json({
      message: "Admin Modified successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
    console.log(error);
  }
};

export const remove = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.memberId);
    await User.findByIdAndDelete(req.params.userId);
    res.json({
      message: "Admin Removed successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const block = async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(req.params.memberId, { isActive: false });
    res.json({
      message: "Admin blocked successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const activate = async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(req.params.memberId, { isActive: true });
    res.json({
      message: "Admin activated successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};
