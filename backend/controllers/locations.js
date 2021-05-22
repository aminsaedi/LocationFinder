const fs = require("fs");
const config = require("config");

const { LocationsModel } = require("../models/locations");

exports.getAllLocationsInCity = async (req, res) => {
  if (!req.params.city)
    return res.status(400).send({ message: "شهر نامشخص است" });
  const locations = await LocationsModel.find({ city: req.params.city })
    .populate("createdBy", "-password -__v")
    .select("-__v");
  if (!locations || locations.length <= 0)
    return res.status(404).send({ message: "هیچ مکانی در این شهر پیدا نشد" });
  let imageUrls = [];
  locations.forEach((location) => {
    location.images.forEach((image) =>
      imageUrls.push(config.get("appUrl") + image)
    );
    location.images = imageUrls;
    imageUrls = [];
  });
  return res.status(200).send(locations);
};

exports.getLocationById = async (req, res) => {
  let location;
  try {
    location = await LocationsModel.findById(req.params.id).populate(
      "createdBy likes comments.userId",
      "-password -__v"
    );
    if (!location) return res.status(404).send({ message: "لوکیشن پیدا نشد" });
  } catch (error) {
    return res.status(400).send({ message: "خطا در پیدا کردنه لوکیشن" });
  }
  location.images.forEach((image, imageIndex) => {
    location.images[imageIndex] = config.get("appUrl") + image;
  });
  return res.status(200).send(location);
};

exports.postNewLocation = async (req, res) => {
  if (!req.user)
    return res.status(403).send({ message: "فقط کاربران میتوانند وارد شوند" });
  const imageNames = [];
  const name = req.body.name;
  const address = req.body.address;
  const description = req.body.description;
  req.files.images &&
    req.files.images.forEach((image) => {
      if (image.mimetype.includes("image/") && image.size <= 3000000) {
        const name = `${req.user._id}__${Date.now()}`;
        fs.writeFile(
          `./public/${name}.${image.mimetype.split("/")[1]}`,
          image.data,
          (err) => console.log(err)
        );
        imageNames.push(`${name}.${image.mimetype.split("/")[1]}`);
      }
    });
  if (!req.body.city || !req.body.location)
    return res.status(400).send({ message: "لوکیشن و شهر مکان نامشخص است" });
  try {
    const location = new LocationsModel({
      name,
      images: imageNames,
      address,
      description,
      city: req.body.city,
      location: req.body.location,
      createdBy: req.user._id,
    });
    await location.save();
    return res.status(200).send(location);
  } catch (error) {
    return res.status(500).send({ message: "خطا در افزودن مکان", error });
  }
};

exports.putLikeLocation = async (req, res) => {
  let location;
  try {
    location = await LocationsModel.findById(req.params.id);
    if (!location)
      return res.status(404).send({ message: "لوکیشن برای لایک پیدا نشد" });
  } catch (error) {
    return res.status(404).send({ message: "لوکیشن برای لایک پیدا نشد" });
  }
  if (req.body.dislike) {
    location.likes = location.likes.filter((like) => like != req.user._id);
    await location.save();
    return res.status(200).send(location.likes.includes(req.user._id));
  }
  if (location.likes.includes(req.user._id))
    return res
      .status(400)
      .send({ message: "شما قبلا این مکان را لایک کرده اید" });
  location.likes.push(req.user);
  await location.save();
  return res.status(200).send(location.likes.includes(req.user._id));
};

exports.postAddComment = async (req, res) => {
  if (!req.body.text)
    return res.status(400).send({ message: "متن کامنت خالی است" });
  let location;
  try {
    location = await LocationsModel.findById(req.params.id).populate(
      "likes",
      "-password -__v"
    );
    if (!location) return res.status(404).send({ message: "لوکیشن پیدا نشد" });
  } catch (error) {
    return res.status(400).send({ message: "خطا در پیدا کردنه لوکیشن" });
  }
  location.comments.push({ userId: req.user._id, text: req.body.text });
  await location.save();
  return res.status(200).send(location.comments);
};

exports.deleteDeleteLocation = async (req, res) => {
  if (!req.params.id)
    return res.status(400).send({ message: "ایدی مکان فرستاده نشده" });
  let location;
  try {
    location = await LocationsModel.findById(req.params.id);
    if (!location) return res.status(404).send({ message: "مکان پیدا نشد" });
  } catch (error) {
    return res.status(400).send({ message: "خطا در پیدا کردن مکان" });
  }
  if (location.createdBy != req.user._id)
    return res.status(403).send({ message: "غیر مجاز" });
  await LocationsModel.findByIdAndRemove(req.params.id);
  return res.status(200).send({ message: "مکان حذف شد" });
};

exports.getUserCreatedLocations = async (req, res) => {
  let locations;
  try {
    locations = await LocationsModel.find({ createdBy: req.user._id });
    if (locations.length <= 0)
      return res.status(404).send({ message: "شما مکانی ایجاد نکرده اید" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "خطا در دریافت مکان های ایجاد شده توسط شما" });
  }
  let imageUrls = [];
  locations.forEach((location) => {
    location.images.forEach((image) =>
      imageUrls.push(config.get("appUrl") + image)
    );
    location.images = imageUrls;
    imageUrls = [];
  });
  return res.status(200).send(locations);
};

exports.getDirection = async (req, res) => {
  if (!req.params.id)
    return res.status(400).send({ message: "ای دی مکان وارد نشده" });
  let location;
  try {
    location = await LocationsModel.findById(req.params.id);
    if (!location) return res.status(404).send({ message: "مکان پیدا نشد" });
  } catch (error) {
    return res.status(400).send({ message: "خطا در پید کردن مکان" });
  }
  const link = `https://www.google.com/maps/search/?api=1&query=${location.location[0]},${location.location[1]}`;
  // Save to database this request

  return res.status(200).send(link);
};
