const express = require("express");
const multer = require("multer");
const RestaurantsList = require("../models/restaurantsList");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }
  // fileFilter: fileFilter
});

router.get("/", (req, res, next) => {
  RestaurantsList.find()
    .select(
      "restaurantsListId restaurantName image rating cousin foodType amount "
    )
    .exec()
    .then((docs) => {
      console.log(docs);
      if (docs.length === 0) {
        // No data found, set error to true
        return res.status(200).json({
          message: "No data found",
          error: true,
          data: []
        });
      }
      const response = {
        message: "Get Data Successfully",
        error: false,
        data: docs.map((doc) => {
          return {
            restaurantsListId: doc.restaurantsListId,
            restaurantName: doc.restaurantName,
            rating: doc.rating,
            cousin: doc.cousin,
            foodType: doc.foodType,
            amount: doc.amount,
            image: doc.image
          };
        })
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "This Product Already Added",
        error: err
      });
    });
});

router.post("/", upload.single("restaurantImage"), async (req, res) => {
  try {
    const imageUrl = req.file
      ? `http://testapi-production-mps.up.railway.app/image/${req.file.filename}`
      : null;

    const restaurantsList = new RestaurantsList({
      restaurantName: req.body.restaurantName,
      rating: req.body.rating,
      cousin: req.body.cousin,
      foodType: req.body.foodType,
      amount: req.body.amount,
      image: imageUrl
    });

    await restaurantsList.save();
    res.status(200).json({
      message: "RestaurantsList created successfully",
      restaurantsList
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

module.exports = router;
