const { verifyToken } = require("../helpers/jwt");

const userAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!/^Bearer/.test(authHeader)) {
    return res.status(500).json({ message: "Unauthorized" });
  }

  try {
    req.user = verifyToken(authHeader.split(" ")[1]);
  } catch (err) {
    return res.status(500).json({ message: "Unauthorized" });
    // return res.send(err);
  }
  return next();
};

module.exports = userAuthMiddleware;
