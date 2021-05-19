//Import Dependencies
const bcrypt = require("bcrypt");
const Profile = require("../models/profile");
const nodemailer = require("nodemailer");

//Models
const User = require("../models/user");

//TODO => MAKE IT PRIVATE
let saltRounds = 10;

const generateRandomNumber = () => {
  let k = 4;
  let result = "";
  while (k-- > 0) {
    result += Math.floor(Math.random() * 9);
  }
  return result;
};

exports.activationLink = (req, res) => {
  User.findOne({ email: req.body.email }, (error, result) => {
    if (error) {
      return res.status(400).json({
        error: "Error in Registration",
      });
    }
    if (result) {
      return res.status(400).json({
        error: "User Already exists",
      });
    }
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "chandru1918g@gmail.com",
        pass: "lfpgbeieoqbtzenq",
      },
    });
    var randomCode = generateRandomNumber();
    var mailOptions = {
      from: "chandru1918g@gmail.com",
      to: req.body.email,
      subject: `Clothings Verification Mail `,
      html: `<h2>Your Verification is <i>${randomCode}</i> (expires in 5 minutes) </h2>`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        return res.status(400).json({
          error: "Error in registration",
        });
      }
    });
    return res.status(200).json({
      message: "Check your mail for Activation code ",
      code: randomCode,
      time: new Date(),
    });
  });
};

// @type POST
// @route /createAccount
// @desc creating new Account
// @access PUBLIC
exports.createAccount = (req, res) => {
  //Find if any other user uses the same mail id
  User.findOne({ email: req.body.email }, (err, prevUser) => {
    if (err || prevUser) {
      return res.status(400).json({
        messsage: "Email Id Already registerd",
        error: true,
      });
    }

    //Hashing password
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      // Store hash in your password req.body.password
      req.body.password = hash;

      //Creating new user and Saving it DB
      let newUser = new User(req.body);
      //Attempt to save
      newUser
        .save()
        .then((newUser) => {
          let userProfile = new Profile({
            user: newUser._id,
            profession: "",
            description: "",
            skills: [],
            phone_number: "",
            portfolio: "",
          });
          userProfile
            .save()
            .then(() =>
              res.status(200).json({
                messsage: "New Account created successfully",
                error: false,
              })
            )
            .catch((error) =>
              res.status(400).json({
                messsage: "Error in creating Account",
                error: true,
              })
            );
        })
        .catch((error) =>
          res.status(400).json({
            messsage: "Error in creating Account",
            error: true,
          })
        );
    });
  });
};

// @type POST
// @route /login
// @desc Login
// @access PUBLIC
exports.login = (req, res) => {
  User.findOne({ email: req.body.email }, (err, prevUser) => {
    if (err) {
      return res.status(400).json({
        messsage: "Error in Loging in",
        error: true,
      });
    }

    //If no email Id regiterd with the req.body.email
    if (!prevUser) {
      return res.status(200).json({
        messsage: "No Account is created with this Email Id",
        error: true,
      });
    }

    //Comparing req.body.password with hased password in DB
    bcrypt.compare(req.body.password, prevUser.password, (err, result) => {
      //If result = false wrong password
      if (err || !result) {
        return res.status(400).json({
          messsage: "Missmatch Password or Email Id",
          error: true,
        });
      }

      //Hide password before sending the response
      prevUser.password = undefined;

      //Password match Login Successfull
      return res.status(200).json({
        messsage: "Login Successfull",
        error: false,
        user: prevUser,
      });
    });
  });
};

exports.getOTPforPassword = (req, res) => {
  console.log(req.body);
  try {
    User.find({ email: req.body.email }, (error, result) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");

      if (error || result.length === 0) {
        return res.status(400).json({
          error: "User not Found",
        });
      }
      var transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
          user: "chandruvk19@outlook.com",
          pass: "chandruvk18", //Password should be mentioned
        },
      });
      var OTP = generateRandomNumber();
      var mailOptions = {
        from: "chandruvk19@outlook.com",
        to: req.body.email,
        subject: `Clothings Verification Mail `,
        html: `<h2>Your OTP <i>${OTP}</i> (expires in 5 minutes) </h2>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        console.log("Ia");
        if (error) {
          return res.status(400).json({
            error: "Error in sending email",
          });
        }
        console.log(OTP, info);
        return res.status(200).json({
          OTP: OTP,
          message: "Check your mail",
        });
      });
      return res.status(200).json({
        OTP: OTP,
        message: "Check your mail",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Error in sending the otp",
    });
  }
};

exports.setNewPassword = (req, res) => {
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) {
      return res.status(400).json({
        error: `Error in Password Updation`,
      });
    }
    User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { password: hash } },
      (error, result) => {
        if (error) {
          return res.status(400).json({
            error: "Error in reseting the password",
          });
        }
        return res.status(200).json({
          message: "Password updated Successfully",
        });
      }
    );
  });
};
