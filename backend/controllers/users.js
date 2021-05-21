const bcrypt = require("bcrypt");
const tokenGenerator = require("../utilities/tokenGenerator");
const config = require("config");

const { UsersModel } = require("../models/users");

exports.postLoginUser = async (req, res) => {
  let user;
  if (!req.body.username || !req.body.password)
    return res
      .status(400)
      .send({ message: "نام کابری و/یا رمزعبور وارد نشده" });
  try {
    user = await UsersModel.findOne({ username: req.body.username });
    if (!user)
      return res
        .status(400)
        .send({ message: "نام کاربری و/یا رمز عبور اشتباه است" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "نام کاربری و/یا رمز عبور اشتباه است" });
  }
  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!correctPassword)
    return res
      .status(400)
      .send({ message: "نام کاربری و/یا رمز عبور اشتباه است" });
  const token = tokenGenerator(user);
  return res.header("x-auth-token", token).status(200).send(token);
};

exports.postRegisterUser = async (req, res) => {
  if (!req.body.username || !req.body.password)
    return res
      .status(400)
      .send({ message: "نام کابری و/یا رمزعبور وارد نشده" });
  const hasUser = await UsersModel.findOne({ username: req.body.username });
  if (hasUser)
    return res
      .status(400)
      .send({ message: "شما قبلا ثبت نام کرده اید لطفا وارد شوید" });
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash(req.body.password, salt);
  try {
    const user = new UsersModel({
      username: req.body.username,
      password,
    });
    await user.save();
    const token = tokenGenerator(user);
    res.status(200).header("x-auth-token", token).send(token);
  } catch (error) {
    res.status(500).send({ message: "خطا در ثبت نام کاربر", error });
  }
};
