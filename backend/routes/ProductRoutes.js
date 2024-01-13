const express = require("express");
const {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/ProductController");

const router = express.Router();

// GET all products
router.get("/", getProducts);

// POST a new product
router.post("/", createProduct);

// DELETE a product
router.delete("/:id", deleteProduct);

// UPDATE a product
router.put("/:id", updateProduct);

module.exports = router;