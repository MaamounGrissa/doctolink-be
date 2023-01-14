import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

export const mailcss = {
  background: `
style="background: rgb(99, 182, 199);
background: linear-gradient(
90deg,
rgba(99, 182, 199, 1) 0%,
rgba(99, 182, 199, 1) 48%,
rgba(99, 182, 199, 1) 100%
);
border-radius: 5px;
padding-left: 10px;
padding-right: 10px;
padding-top: 5px;
padding-bottom: 5px;
color: white;"`,
  body: `
style="background: white;
border-radius: 5px;
padding-left: 10px;
padding-right: 10px;
padding-top: 5px;
padding-bottom: 5px;
color: black;"`,
};
