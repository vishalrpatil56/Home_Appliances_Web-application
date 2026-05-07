const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
 const multer = require("multer");
 const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const productRoutes = require("./productRoutes");
const sendOrderEmail = require("./sendEmail");
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/product", productRoutes);


//----------------------------online payment API--------------------------

const paymentRoutes = require("./payment");

app.use("/api/payment", paymentRoutes);


// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "home_appliances_db",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Failed: ", err);
    // process.exit(1); // Stop server if DB is not connected
  } else {
    console.log("Database Connected Successfully");
  }
});

// Admin login route
app.post("/Adminpenal", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM admin WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).send("Server Error");
    if (results.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];
    // Compare password
    if (user.password !== password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create a token
    const token = jwt.sign({ userId: user.id }, "your_jwt_secret", {
      expiresIn: "1h",
    });
    res.json({ success: true, token });
  });
});

//get service provder
app.get("/serviceproviderslist", (req, res) => {
  db.query("SELECT * FROM service_provider", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Delete service provider
app.delete("/serviceprovider/:id", (req, res) => {
  const serviceProviderId = req.params.id;

  db.query(
    "DELETE FROM service_provider WHERE serviceprovider_id = ?",
    [serviceProviderId],
    (err, result) => {
      if (err) {
        return res.send("Error deleting service provider");
      }
      res.send("Service provider deleted successfully");
    }
  );
});
// List of customers
app.get("/customerslist", (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Delete customer API
app.delete("/customer/:id", (req, res) => {
  const userId = req.params.id;

  db.query("DELETE FROM user WHERE user_id = ?", [userId], (err, result) => {
    if (err) {
      return res.send("Error deleting customer");
    }
    res.send("Customer deleted successfully");
  });
});


// api to add serviceprovider complain
app.post("/submit-serviceprovidercomplaint", (req, res) => {
  const { serviceprovider_id, complain_description } = req.body;

  if (!complain_description) {
    return res.status(400).json({ error: "Complaint Description is required" });
  }

  // Insert complaint into the databaseINSERT INTO complain (serviceprovider_id, complain_description)
  const query = " VALUES (?, ?)";
  db.query(query, [serviceprovider_id, complain_description], (err, result) => {
    if (err) {
      console.error("Error inserting complaint:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true, message: "Complaint submitted successfully" });
  });
});


// Api for fetching complainlist
app.get("/complainlist", (req, res) => {
  db.query("SELECT * FROM complain", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Api for fetching feedbacklist
app.get("/feedbacklist", (req, res) => {
  db.query("SELECT * FROM feedback", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ---------------------- Category Routes ----------------------

// Get all categories
app.get("/categories", async (req, res) => {
  try {
    db.query("SELECT * FROM product_category", (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching categories" });
      }
      res.json(results);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Create a category
app.post("/categories", async (req, res) => {
  const { name, description } = req.body;
  try {
    db.query(
      "INSERT INTO product_category (productcategory_name, productcategory_description) VALUES (?, ?)",
      [name, description],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ message: "Error creating category" });
        }
        db.query(
          "SELECT * FROM product_category WHERE productcategory_id  = ?",
          [result.insertId],
          (err, rows) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ message: "Error fetching created category" });
            }
            res.status(201).json(rows);
          }
        );
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating category" });
  }
});

// Update a category
app.put("/categories/:id", async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;
  try {
    db.query(
      "UPDATE product_category SET productcategory_name = ?, productcategory_description = ? WHERE productcategory_id = ?",
      [name, description, id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ message: "Error updating category" });
        }
        db.query(
          "SELECT * FROM product_category WHERE productcategory_id = ?",
          [id],
          (err, rows) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ message: "Error fetching updated category" });
            }
            res.json(rows);
          }
        );
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error updating category" });
  }
});

// Delete a category
app.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    db.query(
      "DELETE FROM product_category WHERE productcategory_id = ?",
      [id],
      (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Error deleting related subcategories" });
        }
        db.query(
          "DELETE FROM product_category WHERE productcategory_id = ?",
          [id],
          (err) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ message: "Error deleting category" });
            }
            res.json({ message: "Deleted Category" });
          }
        );
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting category" });
  }
});

// ---------------------- Subcategory Routes ----------------------

// Get subcategories by category ID
app.get("/categories/:categoryId/subcategories", async (req, res) => {
  const { categoryId } = req.params;
  try {
    db.query(
      "SELECT * FROM product_sub_category WHERE p_cata_id = ?",
      [categoryId],
      (err, results) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Error fetching subcategories" });
        }
        res.json(results);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching subcategories" });
  }
});

// Create a subcategory
app.post("/categories/:categoryId/subcategories", async (req, res) => {
  const { name, description } = req.body;
  const { categoryId } = req.params;
  try {
    db.query(
  "INSERT INTO product_sub_category (p_sub_cata_name, p_sub_cata_description, p_cata_id) VALUES (?, ?, ?)",
  [name, description, categoryId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(400)
            .json({ message: "Error creating subcategory" });
        }
        db.query(
          "SELECT * FROM product_sub_category WHERE p_cata_id = ?",
          [result.insertId],
          (err, rows) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .json({ message: "Error fetching created subcategory" });
            }
            res.status(201).json(rows);
          }
        );
      }
    );
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error creating subcategory" });
  }
});

// Update a subcategory
app.put("/subcategories/:id", async (req, res) => {
  const { name, description, category_id } = req.body;
  const { id } = req.params;

  try {
    console.log("Updating subcategory with ID:", id); // Log the ID
    console.log("Update data:", { name, description, category_id }); // Log data

    db.query(
      "UPDATE product_sub_category SET p_sub_cata_name = ?, p_sub_cata_description = ?, productcategory_id = ? WHERE p_sub_cata_id = ?",
      [name, description, category_id, id],
      (err, result) => {
        if (err) {
          console.error("Error updating subcategory:", err);
          return res
            .status(500)
            .json({ message: "Error updating subcategory" });
        }

        console.log(
          "Subcategory updated successfully. Rows affected:",
          result.affectedRows
        );

        res.json({ message: "Subcategory updated" }); // Send a success message
      }
    );
  } catch (err) {
    console.error("Error updating subcategory:", err);
    res.status(500).json({ message: "Error updating subcategory" }); // Correct status code
  }
});

// Delete a subcategory
app.delete("/subcategories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    db.query(
      "DELETE FROM product_sub_category WHERE p_sub_cata_id = ?",
      [id],
      (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Error deleting subcategory" });
        }
        res.json({ message: "Deleted Subcategory" });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting subcategory" });
  }
});

// DELETE PRODUCT (ADMIN)
app.delete("/api/delete-product/:id", (req, res) => {
  const productId = req.params.id;

  db.query(
    "DELETE FROM product_details WHERE product_id = ?",
    [productId],
    (err) => {
      if (err) {
        console.error("Delete error:", err);
        return res.status(500).send("Error deleting product");
      }
      res.send("Product deleted successfully");
    }
  );
});

//***************************************  SERVICE PROVIDER  Api  *********************************************************************************************************** */
app.post("/api/serviceproviderregister", async (req, res) => {
  const { userName, userContact, userEmail, password } = req.body;

  try {
    // Validate inputs
    if (!userName || userName.length < 2 || !/^[A-Za-z\s]+$/.test(userName)) {
      return res.status(400).json({ error: "Invalid username." });
    }
    if (!userContact || !/^[0-9]{10}$/.test(userContact)) {
      return res.status(400).json({ error: "Invalid contact number." });
    }
    if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    // Check if email already exists
    db.query(
      "SELECT * FROM service_provider WHERE serviceprovider_email = ?",
      [userEmail],
      async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });

        if (results.length > 0) {
          return res.status(400).json({ error: "Email already registered." });
        }

        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into DB
        db.query(
          "INSERT INTO service_provider (serviceprovider_name, serviceprovider_contact, serviceprovider_email, password) VALUES (?, ?, ?, ?)",
          [userName, userContact, userEmail, password],
          (err, results) => {
            if (err)
              return res.status(500).json({ error: "Registration failed." });

            res.json({ message: "Registration successful." });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Server error." });
  }
});  







// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// API Route to Insert Data into MySQL
app.post("/add-product", upload.single("image"), (req, res) => {
  const {
    name,
    description,
    price,
    subcategory_id,
  } = req.body;

  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO product_details (
      product_name,
      product_description,
      product_price,
      product_image,
      p_sub_cata_id,
      long_description
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, description, price, image, subcategory_id, description],
    (err, result) => {
      if (err) {
        console.log("ERROR:", err);
        return res.status(500).json({ error: err });
      }

      res.json({ success: true });
    }
  );
});

// Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//       cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });


app.get("/api/product/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT * FROM product_details WHERE product_id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result[0]);
    }
  );
});



app.post("/api/feedback", (req, res) => {
  const { id, description, userId } = req.body;

  db.query(
    "INSERT INTO feedback (feedback_id ,feedback_description, user_id) VALUES (?, ?, ?)",
    [id, description, userId],
    (err, result) => {
      if (err) {
        console.error("Error adding feedback:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      res.status(201).json({ message: "Feedback added successfully" });
    }
  );
});



///login route for service provider 
app.post("/ServiceProviderLogin", (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", email, password);

  db.query(
    "SELECT * FROM service_provider WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false });
      }

      if (results.length === 0) {
        return res.json({ success: false });
      }

      const user = results[0];

      if (user.password !== password) {
        return res.json({ success: false });
      }

      res.json({
        success: true,
        token: "dummy-token",
        serviceprovider_id: user.serviceprovider_id
      });
    }
  );
});





// add serviceprovider complain in database
app.post("/submit-service-complaint", (req, res) => {
  const { serviceprovider_id, message } = req.body;

  if (!serviceprovider_id || !message) {
    return res.status(400).json({ error: "Service Provider ID and Complaint message are required" });
  }

  // Validate serviceprovider_id exists in the service_provider table
  db.query("SELECT * FROM service_provider WHERE serviceprovider_id = ?", [serviceprovider_id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ error: "Invalid Service Provider ID" });
    }

    // Insert complaint into database
    const query = "INSERT INTO complain (serviceprovider_id, complain_text) VALUES (?, ?)";
    db.query(query, [serviceprovider_id, message], (err, result) => {
      if (err) {
        console.error("Error inserting complaint:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ success: true, message: "Service provider complaint submitted successfully" });
    });
  });
});










// add service provider feedback in database 

app.post("/submit-serviceprovider-feedback", (req, res) => {
  const { serviceprovider_id, feedback } = req.body;

  if (!serviceprovider_id || !feedback) {
      return res.status(400).json({ error: "Service Provider ID and Feedback are required" });
  }

  // Check if service provider exists before inserting feedback
  db.query("SELECT * FROM service_provider WHERE serviceprovider_id = ?", [serviceprovider_id], (err, result) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
      }

      if (result.length === 0) {
          return res.status(400).json({ error: "Invalid Service Provider ID" });
      }

      // Insert feedback into the feedback table
      const query = "INSERT INTO feedback (serviceprovider_id, feedback_description) VALUES (?, ?)";
      db.query(query, [serviceprovider_id, feedback], (err, result) => {
          if (err) {
              console.error("Error inserting feedback:", err);
              return res.status(500).json({ error: "Database error" });
          }
          res.json({ success: true, message: "Feedback submitted successfully" });
      });
  });
});
   


//***************************************   User's  Api  *********************************************************************************************************** */

app.post("/api/register", async (req, res) => {
  const { userName, userContact, userEmail, password } = req.body;

  try {
    // Validate inputs
    if (!userName || userName.length < 2 || !/^[A-Za-z\s]+$/.test(userName)) {
      return res.status(400).json({ error: "Invalid username." });
    }
    if (!userContact || !/^[0-9]{10}$/.test(userContact)) {
      return res.status(400).json({ error: "Invalid contact number." });
    }
    if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters." });
    }

    // Check if email already exists
    db.query(
      "SELECT * FROM user WHERE user_email = ?",
      [userEmail],
      async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });

        if (results.length > 0) {
          return res.status(400).json({ error: "Email already registered." });
        }

        // Hash password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into DB
        db.query(
          "INSERT INTO user (user_name, user_contact, user_email, password) VALUES (?, ?, ?, ?)",
          [userName, userContact, userEmail, password],
          (err, results) => {
            if (err)
              return res.status(500).json({ error: "Registration failed." });

            res.json({ message: "Registration successful." });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Server error." });
  }
});


// User login route
app.post("/api/login", (req, res) => {
  const { userEmail, email, password } = req.body;

  // Accept both formats (userEmail or email)
  const finalEmail = userEmail || email;

  console.log("Login Data:", req.body); // ✅ moved inside

  db.query(
    "SELECT * FROM user WHERE user_email = ?",
    [finalEmail],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server Error");
      }

      if (results.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid email",
        });
      }

      const user = results[0];

      // Password check
      if (user.password !== password) {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
        });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.user_id },
        "your_jwt_secret",
        { expiresIn: "1h" }
      );

      res.json({
        success: true,
        token,
        user_id: user.user_id,
        user_name: user.user_name,
      });
    }
  );
});

// user feedback
app.post("/submit-feedback", (req, res) => {
  const { user_id, feedback } = req.body;

  if (!user_id || !feedback) {
      return res.status(400).json({ error: "User ID and Feedback are required" });
  }


  // Check if user exists before inserting feedback
  db.query("SELECT * FROM user WHERE user_id = ?", [user_id], (err, result) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
      }

      if (result.length === 0) {
          return res.status(400).json({ error: "Invalid user ID" });
      }

      // Insert feedback into database
      const query = `INSERT INTO feedback (customer_id, feedback_text) VALUES (?, ?)`;
      db.query(query, [user_id, feedback], (err, result) => {
          if (err) {
              console.error("Error inserting feedback:", err);
              return res.status(500).json({ error: "Database error" });
          }
          res.json({ success: true, message: "Feedback submitted successfully" });
      });
  });
});


// UPDATE COMPLETE PRODUCT
app.put("/api/update-product/:id", (req, res) => {

  const { id } = req.params;

  const {
    name,
    description,
    long_description,
    price
  } = req.body;

  const sql = `
    UPDATE product_details
    SET
      product_name = ?,
      product_description = ?,
      long_description = ?,
      product_price = ?
    WHERE product_id = ?
  `;

  db.query(
    sql,
    [
      name,
      description,
      long_description,
      price,
      id
    ],
    (err, result) => {

      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "Error updating product"
        });
      }

      res.json({
        success: true,
        message: "Product updated successfully"
      });
    }
  );
});

//user complains


app.post("/api/complaint", (req, res) => {
  const { complain_text } = req.body;

  const query = `
    INSERT INTO complain (customer_id, product_id, complain_text, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [2, null, complain_text, "pending"], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ message: "Complaint submitted successfully" });
  });
});




// Fetch all customer feedback

app.get("/serviceprovider-feedback-list", (req, res) => {
  const query = `
    SELECT feedback.feedback_id, feedback.feedback_text, feedback.created_at, user.user_name
    FROM feedback
    JOIN user ON feedback.customer_id = user.user_id
    ORDER BY feedback.created_at DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true, feedbacks: result });
  });
});



//fetch all customer comlaints
app.get("/usercomplainlist", (req, res) => {
  const sql = `
    SELECT 
      complain.complain_id AS id,
      complain.complain_text AS message,
      complain.status,
      complain.created_at,
      user.user_name AS user_name
    FROM complain
    LEFT JOIN user ON complain.customer_id = user.user_id
    ORDER BY complain.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ complaints: result });
  });
});

app.put("/update-complaint-status/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE complain SET status = 'resolved' WHERE complain_id = ?",
    [id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ success: true });
    }
  );
});



// Place order route (requires authentication)
app.post("/api/orders", (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token.replace("Bearer ", ""),
    "your_jwt_secret",
    (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const userId = decoded.userId;
      const { customer, products, total, date } = req.body;

      db.query(
        "INSERT INTO orders (user_id, customer_name, customer_email, customer_address, customer_phone, products, total, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          customer.name,
          customer.email,
          customer.address,
          customer.phone,
          JSON.stringify(products),
          total,
          date,
        ],
        (err, results) => {
          if (err) {
            console.error("Error placing order: ", err);
            return res.status(500).json({ message: "Error placing order" });
          }
          res.json({ message: "Order placed successfully" });
        }
      );
    }
  );
});



//---------------------------------------------------------------get products in customer side-------------------------------------------

//-------TELIVISION---------------
/*app.get('/api/televisions/led', (req, res) => {
  const sql = `
      SELECT product_details.*, product_sub_category.p_sub_cata_name AS subCategoryName
      FROM product_details
      JOIN product_sub_category ON product_details.p_sub_cata_id = product_sub_category.p_sub_cata_id
      WHERE product_sub_category.p_sub_cata_name = 'LED'`;

  db.query(sql, (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});*/

app.get('/api/televisions/led', (req, res) => {
  const sql = `
    SELECT pd.*
    FROM product_details pd
    JOIN product_sub_category psc 
    ON pd.p_sub_cata_id = psc.p_sub_cata_id
    WHERE psc.p_sub_cata_id = 3
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/televisions/qled', (req, res) => {
  const sql = `
      SELECT product_details.*, product_sub_category.p_sub_cata_name AS subCategoryName
      FROM product_details
      JOIN product_sub_category ON product_details.p_sub_cata_id = product_sub_category.p_sub_cata_id
      WHERE product_sub_category.p_sub_cata_name = 'QLED'
  `;

  db.query(sql, (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});
//---------WASHING MACHINE-----------------
app.get('/api/washingmachines/topload', (req, res) => {
    const sql = `
        SELECT product_details.*, product_sub_category.p_sub_cata_name AS subCategoryName
        FROM product_details
        JOIN product_sub_category ON product_details.p_sub_cata_id = product_sub_category.p_sub_cata_id
        WHERE product_sub_category.p_sub_cata_name = 'Top Load'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.get('/api/washingmachines/frontload', (req, res) => {
    const sql = `
        SELECT product_details.*, product_sub_category.p_sub_cata_name AS subCategoryName
        FROM product_details
        JOIN product_sub_category ON product_details.p_sub_cata_id = product_sub_category.p_sub_cata_id
        WHERE product_sub_category.p_sub_cata_name = 'Front Load'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

//-------------------Air Conditioners----------------------

app.get('/api/airconditioners/split', (req, res) => {
  const sql = `
      SELECT product_details.*, product_sub_category.p_sub_cata_name AS subCategoryName
      FROM product_details
      JOIN product_sub_category ON product_details.p_sub_cata_id = product_sub_category.p_sub_cata_id
      WHERE product_sub_category.p_sub_cata_name = 'Split AC'
  `;

  db.query(sql, (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});

app.get('/api/airconditioners/window', (req, res) => {
  const sql = `
      SELECT product_details.*, product_sub_category.p_sub_cata_name AS subCategoryName
      FROM product_details
      JOIN product_sub_category ON product_details.p_sub_cata_id = product_sub_category.p_sub_cata_id
      WHERE product_sub_category.p_sub_cata_name = 'Window AC'
  `;

  db.query(sql, (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});

//--------------------------REFRIGERATORS---------------------------





// Single Door endpoint
app.get('/api/refrigerators/singledoor', (req, res) => {
    const sql = `
        SELECT product_details.*, product_sub_category.p_sub_cata_name AS subCategoryName
        FROM product_details
        JOIN product_sub_category ON product_details.p_sub_cata_id = product_sub_category.p_sub_cata_id
        WHERE product_sub_category.p_sub_cata_name = 'Single Door'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Double Door endpoint
app.get('/api/refrigerators/doubledoor', (req, res) => {
    const sql = `
        SELECT product_details.*, product_sub_category.p_sub_cata_name AS subCategoryName
        FROM product_details
        JOIN product_sub_category ON product_details.p_sub_cata_id = product_sub_category.p_sub_cata_id
        WHERE product_sub_category.p_sub_cata_name = 'Double Door'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Triple Door endpoint
app.get('/api/refrigerators/tripledoor', (req, res) => {
    const sql = `
        SELECT product_details.*, product_sub_category.p_sub_cata_name AS subCategoryName
        FROM product_details
        JOIN product_sub_category ON product_details.p_sub_cata_id = product_sub_category.p_sub_cata_id
        WHERE product_sub_category.p_sub_cata_name = 'Tripple Door'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Side-by-Side endpoint
app.get('/api/refrigerators/sidebyside', (req, res) => {
    const sql = `
        SELECT product_details.*, product_sub_category.p_sub_cata_name AS subCategoryName
        FROM product_details
        JOIN product_sub_category ON product_details.p_sub_cata_id = product_sub_category.p_sub_cata_id
        WHERE product_sub_category.p_sub_cata_name = 'Side-by-side Door'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// ---------------------- Server Start ----------------------

app.listen(5000, () => {
  console.log("The Server is Running on port 5000..........");
});


//------------RO API----------------------------------

app.get('/api/waterpurifiers', (req, res) => {
  const sql = `
    SELECT pd.*
    FROM product_details pd
    JOIN product_sub_category psc 
    ON pd.p_sub_cata_id = psc.p_sub_cata_id
    WHERE psc.p_sub_cata_name = 'RO Water Purifier'
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});
//------------------complaint delete-------------------
app.delete("/delete-complaint/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM complaints WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Delete failed" });

    res.json({ message: "Deleted successfully" });
  });
});
//------------------feedback delete-------------------
app.delete("/delete-feedback/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM feedback WHERE feedback_id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Delete failed" });
    }

    res.json({ message: "Feedback deleted successfully" });
  });
});

app.post("/place-order", (req, res) => {
  const { customer_id, products, total_price, name, email, phone, address, paymentMethod } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: "No products" });
  }

  const orderGroupId = "ORD-" + Date.now(); // unique order id
let completed = 0;

products.forEach((item) => {
  const sql = `
    INSERT INTO product_order 
    (order_group_id, customer_id, product_id, quantity, total_price, order_date, name, email, phone, address)
    VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      orderGroupId, //  SAME ID for all products
      customer_id,
      item.product_id,
      item.quantity,
      total_price,
      name,
      email,
      phone,
      address
    ],
    async (err) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ message: "Insert failed" });
      }

      completed++;

      if (completed === products.length) {
        try {
          await sendOrderEmail({
            name,
            email,
            phone,
            address,
            paymentMethod: paymentMethod || "Online",
            totalAmount: total_price,
            items: products
          });

          res.json({ message: "Order placed successfully & email sent" });

        } catch (emailError) {
          console.log("EMAIL ERROR:", emailError);
          res.json({ message: "Order placed but email failed" });
        }
      }
    }
  );
});
});

app.get("/get-orders", (req, res) => {
  const sql = `
    SELECT 
  po.order_group_id,
  po.order_id,
  po.name,
  po.email,
  po.phone,
  po.address,
  po.product_id,
  pd.product_name,
  pd.product_price,
  po.quantity,
  po.total_price,
  po.order_date
FROM product_order po
LEFT JOIN product_details pd 
ON po.product_id = pd.product_id
ORDER BY po.order_group_id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "DB error" });
    }

    res.json({ orders: result });
  });
});

app.delete("/delete-order/:groupId", (req, res) => {
  db.query(
    "DELETE FROM product_order WHERE order_group_id = ?",
    [req.params.groupId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
});



app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});