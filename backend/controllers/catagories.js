const { CatagoriesModel } = require("../models/catagories");

exports.getAllCatagories = async (req, res) => {
  let catagories;
  try {
    catagories = await CatagoriesModel.find().select("-__v");
    if (!catagories || catagories.length <= 0)
      return res.status(404).send({ message: "هیچ گروهی وجود ندارد" });
  } catch (error) {
    return res.send(400).send({ message: "خطا در دریافت گروه ها" });
  }
  return res.status(200).send(catagories);
};

exports.postNewCatagory = async (req, res) => {
  if (!req.body.name)
    return res.status(400).send({ message: "اسم گروه خالی است" });
  const catagory = new CatagoriesModel({
    name: req.body.name,
  });
  try {
    await catagory.save();
  } catch (error) {
    return res.status(500).send({ message: "خطا در ایجاد گروه" });
  }
  return res.status(200).send(catagory);
};
