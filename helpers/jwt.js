const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "30d";

const generateToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const verifyToken = (payload) => jwt.verify(payload, JWT_SECRET);

module.exports = {
  generateToken,
  verifyToken,
};
