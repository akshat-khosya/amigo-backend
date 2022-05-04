const Auth = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email");
exports.login = async (req, res) => {
  try {
    const checkUser = await Auth.findOne({ email: req.body.email });
    if (checkUser) {
      const validate = await bcrypt.compare(
        req.body.password,
        checkUser.password
      );
      if (validate) {
        if (checkUser.emailVerification) {
          const { password, ...others } = checkUser._doc;
          const token = jwt.sign(
            { uid: checkUser._id.toHexString() },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
          );
          return res
            .status(200)
            .json({ data: { userData: others, token: token } });
        }
        return res.status(401).json({ data: { message: "Verify you email" } });
      }
    }
    return res.status(401).json({ data: { message: "Invalid Credentials" } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ data: { message: "server error" } });
  }
};

exports.register = async (req, res) => {
  try {
    const checkUser = await Auth.findOne({ email: req.body.email });
    if (checkUser) {
      return res.status(409).json({ data: { message: "server error" } });
    }

    const salt = await bcrypt.genSalt(10);
    const hasedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hasedPass;
    const newUser = new Auth(req.body);
    const result = await newUser.save();
    if (result) {
      const link = `${process.env.URL}api/auth/verifyemail/${
        result.email
      }/${result._id.toHexString()}`;
      sendEmail(
        req.body.email,
        "verify email",
        `<a href=${link}>Verify email</a>`
      );
      return res
        .status(200)
        .json({ data: { message: "user registered succesfully" } });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ data: { message: "server error" } });
  }
};

exports.autoLogin=async (req,res)=>{
    if(req.user){
      const sendData= await Auth.findOne({_id:req.user});
      const { password, ...others } = sendData._doc;
      return res.status(200).json({ data: others});
    }else{
      return res
          .status(401)
          .json({ data: { message: "Invalid Credentials" } });
    }
  }
exports.verifyEmail = async (req, res) => {
  const { email, token } = req.params;
  try {
    const checkUser = await Auth.findOne({ email: email });
    if (checkUser.emailVerification) {
      return res
        .status(401)
        .json({ data: { message: "You are already verified" } });
    }
    if (checkUser._id.toHexString() === token) {
      const user = await Auth.updateOne(
        { email: email },
        { emailVerification: true }
      );
      if (user) {
        return res
          .status(200)
          .json({ data: { message: "You are  verified" } });
      }
    }
    return res.status(401).json({ data: { message: "Invalid link" } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ data: { message: "server error" } });
  }
};
