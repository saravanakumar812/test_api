const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/orders");
const multer = require("multer");
const Product = require("../models/product");

const upload = multer({ dest: "uploads/" });

router.get("/", (req, res, next) => {
  Order.find()
    .select("productId orderPrice _id")
    .exec()
    .then((docs) => {
      console.log(docs);
      const response = {
        message: "Get Data Successfully",
        count: docs.length,
        products: docs.map((doc) => {
          return {
            productId: doc.productId,
            orderPrice: doc.orderPrice,
            _id: doc._id,
            request: {
              method: "GET",
              url: "http://localhost:3000/orders/" + doc._id
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
});

router.post("/", (req, res, next) => {
  Product.findById()
    .then((product) => {
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        productId: req.body.productId,
        orderPrice: req.body.orderPrice
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Order Added Successfully",
        order: {
          productId: result.productId,
          orderPrice: result.orderPrice,
          _id: result._id,
          request: {
            method: "POST",
            url: "http://localhost:3000/orders/" + result._id
          }
        }
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
  // res.status(200).json({
  //   message: "Orders Placed SuccessFully!",
  //   orderList: order
  // });
});

router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Order.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "updated Successfully",
        request: {
          method: "PATCH",
          url: "http://localhost:3000/orders/" + id
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Deleted Successfully",
        request: {
          method: "DELETE",
          url: "http://localhost:3000/orders/" + id
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

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          data: {
            productId: doc.productId,
            orderPrice: doc.orderPrice,
            _id: doc._id,
            request: {
              method: "GET",
              url: "http://localhost:3000/orders/" + doc._id
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
