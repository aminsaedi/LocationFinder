const mongoose = require("mongoose");

const CatagoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const CatagoriesModel = mongoose.model("catagories", CatagoriesSchema);

module.exports.CatagoriesSchema = CatagoriesSchema;
module.exports.CatagoriesModel = CatagoriesModel;
