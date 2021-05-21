const express = require("express");

const usersRoute = require("../routes/users");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/v1/users", usersRoute);
};
