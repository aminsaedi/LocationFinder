const expressFileUpload = require("express-fileupload");

module.exports = function (app) {
  app.use(expressFileUpload());
};
