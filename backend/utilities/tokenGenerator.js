const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = (user) => {
  const toknen = jwt.sign(
    {
      _id: user._id,
      username: user.username,
    },
    config.get("locationFinderKey")
  );
  return toknen;
};
