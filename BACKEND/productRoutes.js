const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// DB connection (same as server.js)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "home_appliances_db",
});

// TEST ROUTE (important)
router.get("/test", (req, res) => {
  res.send("Product route working");
});

// GET product by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;

  // 1️⃣ Get product details
  db.query(
    "SELECT * FROM product_details WHERE product_id = ?",
    [id],
    (err, productResult) => {
      if (err) return res.status(500).json(err);

      if (productResult.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      const product = productResult[0];

      // 2️⃣ Get product images
      db.query(
        "SELECT image_url FROM product_images WHERE product_id = ?",
        [id],
        (err, imageResult) => {
          if (err) return res.status(500).json(err);

          // 3️⃣ Attach images to product
          product.images = imageResult;

          res.json(product);
        }
      );
    }
  );
});
module.exports = router;