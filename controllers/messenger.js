import Room from "../models/room.js";
import moment from "moment";
import { io } from "../server.js";

export const sendMessage = async (req, res) => {
  const data = req.body;
  try {
    const room = await Room.findOne({
      patient: data.patient,
      establishment: data.establishment,
    });
    if (room) {
      await room.messages.push({
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        date: moment().format("yyyy-MM-DDThh:mm"),
      });
      await room.save();
    } else {
      const newRoom = new Room({
        establishment: data.establishment,
        patient: data.patient,
        messages: [
          {
            sender: data.sender,
            receiver: data.receiver,
            text: data.text,
            date: moment().format("yyyy-MM-DDThh:mm"),
          },
        ],
      });
      newRoom.save();
    }
    io.to(data.establishment).emit("update-chat");
    io.to(data.receiver).emit("update-chat");
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const getRooms = async (req, res) => {
  const rooms = await Room.find({ establishment: req.params.id })
    .populate({
      path: "patient messages.sender messages.receiver establishment",
      select: "-password",
    })
    .sort({ "messages.date": -1 });
  res.status(200).json(rooms);
};

export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate({
        path: "patient messages.sender messages.receiver establishment",
        select: "-password",
      })
      .sort({ "messages.date": -1 });

    for (let i = 0; i < room.messages.length; i++) {
      if (room.messages[i].sender.role === "PATIENT") {
        room.messages[i].read = true;
      }
    }
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const unreadCount = async (req, res) => {
  var count = 0;
  const rooms = await Room.find({ establishment: req.params.id }).populate({
    path: "patient messages.sender messages.receiver establishment",
    select: "-password",
  });

  if (rooms.length > 0) {
    for (let i = 0; i < rooms.length; i++) {
      for (let j = 0; j < rooms[i].messages.length; j++) {
        if (
          rooms[i].messages[j].sender.role === "PATIENT" &&
          !rooms[i].messages[j].read
        )
          count += 1;
      }
    }
  }
  res.status(200).json(count);
};

export const getRoomsPatient = async (req, res) => {
  const rooms = await Room.find({
    patient: req.params.id,
  })
    .populate({
      path: "patient messages.sender messages.receiver establishment",
      select: "-password",
    })
    .sort({ "messages.date": -1 });
  res.status(200).json(rooms);
};

export const getRoomPatient = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate({
        path: "patient messages.sender messages.receiver establishment",
        select: "-password",
      })
      .sort({ "messages.date": -1 });

    for (let i = 0; i < room.messages.length; i++) {
      if (room.messages[i].sender.role !== "PATIENT") {
        room.messages[i].read = true;
      }
    }
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong !" });
  }
};

export const unreadCountPatient = async (req, res) => {
  var count = 0;
  const rooms = await Room.find({ patient: req.params.id }).populate({
    path: "patient messages.sender messages.receiver establishment",
    select: "-password",
  });
  for (let i = 0; i < rooms.length; i++) {
    for (let j = 0; j < rooms[i].messages.length; j++) {
      if (
        rooms[i].messages[j].sender.role !== "PATIENT" &&
        !rooms[i].messages[j].read
      )
        count += 1;
    }
  }
  res.status(200).json(count);
};
