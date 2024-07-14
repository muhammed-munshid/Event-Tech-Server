/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).send({
            message: "Session expired. Please log in again.",
            expired: true
          });
        } else {
          return res.status(401).send({
            message: "You have no account. Please log in.",
            noToken: true
          });
        }
      } else {
        req.body.userId = decoded.id;
        if (!req.body.userId) {
          return res.status(200).send({
            message: "You have no account. Please log in.",
            noAcc: true
          });
        } else {
          next();
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: "Auth Failed",
      success: false
    });
  }
};
