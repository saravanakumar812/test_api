const express = require("express");
const multer = require("multer");
const Food = require("../models/food");
const router = express.Router();
const path = require("path");

// Configure multer to store images in an 'uploads' directory
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
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

router.get("/", (req, res, next) => {
  Food.find()
    .select("foodName image")
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
            foodName: doc.foodName,
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

  // res.status(200).json({
  //   message: "IT Get Works!",
  //   error: "true",

  // });
});

// Route to handle product creation with an image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const imageUrl = req.file
      ? `http://testapi-production-mps.up.railway.app/image/${req.file.filename}`
      : null;

    const food = new Food({
      foodName: req.body.foodName,
      image: imageUrl
    });

    await food.save();
    res.status(200).json({ message: "Product created successfully", food });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

module.exports = router;
