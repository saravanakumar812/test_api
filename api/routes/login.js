const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const Signup = require("../models/signup");
const upload = multer();

router.post("/", upload.none(), async (req, res, next) => {
  try {
    const check = await Signup.findOne({ email: req.body.email });

    if (check) {
      // If the user exists, check the password
      if (check.password === req.body.password) {
        res.status(200).json({
          message: "Login Successfully",
          error: false,
          data: {
            userId: check.userId,
            name: check.name,
            email: check.email,
            password: check.password,
            phoneNumber: check.phoneNumber,
            address: check.address,
            city: check.city,
            state: check.state,
            country: check.country,
            pincode: check.pincode

            // any other data you want to send back
          }
        });
      } else {
        // If the password does not match
        res.status(400).json({
          message: "Incorrect password",
          error: true
        });
      }
    } else {
      // If no user is found
      res.status(404).json({
        message: "User not found",
        error: true
      });
    }
  } catch (e) {
    // Handle any other errors
    res.status(500).json({
      message: "An error occurred during login",
      error: e
    });
  }

  //   try {
  //     const check = await Signup.findOne({ name: req.body.name });

  //     if (check.password === req.body.password) {
  //       res.status(200).json({
  //         message: "login Successfully",
  //         error: false
  //       });
  //     } else {
  //       res.status(500).json({
  //         message: "An error occurred during login",
  //         error: err
  //       });
  //     }
  //   } catch (e) {
  //     res.send("wrong details");
  //   }
});
module.exports = router;
