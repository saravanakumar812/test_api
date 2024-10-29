const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Product = require("../models/product");
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
  storage: storage
});
// const upload = multer({ dest: "/uploads" });

router.get("/", (req, res, next) => {
  Product.find()
    .select("productName price _id productImage")
    .exec()
    .then((docs) => {
      console.log(docs);
      const response = {
        message: "Get Data Successfully",
        count: docs.length,
        products: docs.map((doc) => {
          return {
            productName: doc.productName,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              method: "GET",
              url: "http://localhost:4000/products/" + doc._id
            }
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

router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  // const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const imageUrl = req.file
    ? `http://localhost:4000/productImage/${req.file.filename}`
    : null;

  console.log(imageUrl);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    productName: req.body.productName,
    price: req.body.price,
    productImage: imageUrl
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product Add Successfully",
        createdProduct: {
          productName: result.productName,
          price: result.price,
          _id: result._id,
          productImage: imageUrl,
          request: {
            method: "POST",
            url: "http://localhost:4000/products/" + result._id
          }
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "This Product Already Added",
        error: err
      });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "updated Successfully",
        request: {
          method: "PATCH",
          url: "http://localhost:4000/products/" + id
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Deleted Successfully",
        request: {
          method: "DELETE",
          url: "http://localhost:3000/products/" + id
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "This Product Already Deleted",
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("productName price _id")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          data: {
            productName: doc.productName,
            price: doc.price,
            _id: doc._id,
            request: {
              method: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          }
        });
      } else {
        res.status(404).json({
          message: "No Data Available Here"
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  // if (id === "special") {
  //   res.status(200).json({
  //     message: "It POST  Works!",
  //     id: id
  //   });
  // } else {
  //   res.status(200).json({
  //     error: "true"
  //   });
  // }
});

module.exports = router;
