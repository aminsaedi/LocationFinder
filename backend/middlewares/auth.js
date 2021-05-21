const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  if (!config.get("activeAuth")) return next();
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("No token provided.");
  try {
    const decode = jwt.verify(token, config.get("locationFinderKey"));
    req.user = decode;
    return next();
  } catch (error) {
    return res.status(400).send("Invalid token.");
  }
  return next();
};
