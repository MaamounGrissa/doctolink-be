import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    jwt.verify(token, secret);
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default auth;
