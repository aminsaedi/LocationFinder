const express = require("express");

const usersRoute = require("../routes/users");
const locationsRoute = require("../routes/locations");
const catagoriesRoue = require("../routes/catagories");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/v1/users", usersRoute);
  app.use("/api/v1/locations", locationsRoute);
  app.use("/api/v1/catagories", catagoriesRoue);
};
