const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const Signup = require("../models/signup");
const upload = multer();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   }
// });
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname + "-" + uniqueSuffix);
//   }
// });
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 },
//   fileFilter: fileFilter
// });
// const upload = multer({ dest: "/uploads" });

// router.get("/", (req, res, next) => {
//   Signup.find()
//     .select("productName price _id name")
//     .exec()
//     .then((docs) => {
//       console.log(docs);
//       const response = {
//         message: "Get Data Successfully",
//         count: docs.length,
//         products: docs.map((doc) => {
//           return {
//             productName: doc.productName,
//             price: doc.price,
//             _id: doc._id,
//             request: {
//               method: "GET",
//               url: "http://localhost:3000/products/" + doc._id
//             }
//           };
//         })
//       };
//       res.status(200).json(response);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         message: "This Product Already Added",
//         error: err
//       });
//     });

//   // res.status(200).json({
//   //   message: "IT Get Works!",
//   //   error: "true",

//   // });
// });

router.post("/", upload.none(), async (req, res, next) => {
  try {
    // Check if the user already exists
    const existingUser = await Signup.findOne({ email: req.body.email });

    if (existingUser) {
      // If user already exists, return an error message
      return res.status(400).json({
        message: "User already exists. Please try a different name.",
        error: true
      });
    }

    // Create a new signup document
    const newSignup = new Signup({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      country: req.body.country
    });

    // Save the new signup document
    const result = await newSignup.save();

    // Success response
    res.status(200).json({
      message: "Sign Up Successfully",
      error: false,
      userId: result.userId
    });
  } catch (err) {
    // Error response
    console.error(err);
    res.status(500).json({
      message: "An error occurred during signup",
      error: err
    });
  }

  //   const signup = new Signup({
  //     name: req.body.name,
  //     password: req.body.password
  //   });
  //   signup
  //     .save()
  //     .then((result) => {
  //       console.log(result);
  //       res.status(200).json({
  //         message: "Sign Up Successfully",
  //         error: false
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(500).json({
  //         message: "This Details Already Added",
  //         error: err
  //       });
  //     });
});

// router.patch("/:productId", (req, res, next) => {
//   const id = req.params.productId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   Product.updateOne({ _id: id }, { $set: updateOps })
//     .exec()
//     .then((result) => {
//       console.log(result);
//       res.status(200).json({
//         message: "updated Successfully",
//         request: {
//           method: "PATCH",
//           url: "http://localhost:3000/products/" + id
//         }
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json(err);
//     });
// });
// router.delete("/:productId", (req, res, next) => {
//   const id = req.params.productId;
//   Product.deleteOne({ _id: id })
//     .exec()
//     .then((result) => {
//       console.log(result);
//       res.status(200).json({
//         message: "Deleted Successfully",
//         request: {
//           method: "DELETE",
//           url: "http://localhost:3000/products/" + id
//         }
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         message: "This Product Already Deleted",
//         error: err
//       });
//     });
// });

// router.get("/:productId", (req, res, next) => {
//   const id = req.params.productId;
//   Product.findById(id)
//     .select("productName price _id")
//     .exec()
//     .then((doc) => {
//       console.log(doc);
//       if (doc) {
//         res.status(200).json({
//           product: doc,
//           data: {
//             productName: doc.productName,
//             price: doc.price,
//             _id: doc._id,
//             request: {
//               method: "GET",
//               url: "http://localhost:3000/products/" + doc._id
//             }
//           }
//         });
//       } else {
//         res.status(404).json({
//           message: "No Data Available Here"
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
//   // if (id === "special") {
//   //   res.status(200).json({
//   //     message: "It POST  Works!",
//   //     id: id
//   //   });
//   // } else {
//   //   res.status(200).json({
//   //     error: "true"
//   //   });
//   // }
// });

module.exports = router;
