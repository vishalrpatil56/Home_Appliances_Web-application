import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header1";

const ProductDetails = () => {

  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] =
    useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    long_description: "",
    price: "",
    category_id: "",
    subcategory_id: "",
    image: null,
  });

  const [searchId, setSearchId] = useState("");

  const [product, setProduct] = useState(null);

  useEffect(() => {

    axios
      .get("http://54.84.125.102:5000/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleFile = (e) => {

    setFormData({
      ...formData,
      image: e.target.files[0],
    });

  };

  const handleCategoryChange = async (e) => {

    const categoryId = e.target.value;

    if (!categoryId) return;

    setFormData({
      ...formData,
      category_id: categoryId,
      subcategory_id: "",
    });

    try {

      const res = await axios.get(
        `http://54.84.125.102:5000/categories/${categoryId}/subcategories`
      );

      setSubCategories(res.data);

    } catch (err) {

      console.error(err);

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);

    data.append(
      "description",
      formData.description
    );

    data.append(
      "long_description",
      formData.long_description
    );

    data.append("price", formData.price);

    data.append(
      "subcategory_id",
      formData.subcategory_id
    );

    data.append("image", formData.image);

    try {

      await axios.post(
        "http://54.84.125.102:5000/add-product",
        data
      );

      toast.success(
        "Product added successfully!"
      );

    } catch (err) {

      toast.error("Error adding product");

    }
  };

  const searchProduct = async () => {

    try {

      const res = await axios.get(
        `http://54.84.125.102:5000/api/product/${searchId}`
      );

      setProduct(res.data);

    } catch {

      toast.error("Product not found");

    }
  };

  const updateProduct = async () => {

    try {

      await axios.put(
        `http://54.84.125.102:5000/api/update-product/${searchId}`,
        {
          name: product.product_name,
          description:
            product.product_description,
          long_description:
            product.long_description,
          price: product.product_price,
        }
      );

      toast.success(
        "Product updated successfully!"
      );

      searchProduct();

    } catch (err) {

      toast.error("Update failed");

    }
  };

  const deleteProduct = async () => {

    if (
      window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      try {

        await axios.delete(
          `http://54.84.125.102:5000/api/delete-product/${searchId}`
        );

        toast.success(
          "Product deleted successfully!"
        );

        setProduct(null);

      } catch {

        toast.error("Delete failed");

      }
    }
  };

  return (
    <>
      

      <div
        style={{
          minHeight: "100vh",
          background: "#f4f7fc",
          paddingTop: "40px",
          paddingRight: "40px",
          paddingBottom: "40px",
          paddingLeft: "40px",
          display: "flex",
justifyContent: "center",
        }}
      >
        {/* ADD PRODUCT */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.12)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              marginBottom: "25px",
              fontWeight: "700",
            }}
          >
            Add Product
          </h2>

          <form onSubmit={handleSubmit}>

            <input
              className="form-control mb-3"
              name="name"
              placeholder="Product Name"
              onChange={handleChange}
              required
            />

            <select
              className="form-control mb-3"
              onChange={handleCategoryChange}
              value={formData.category_id}
            >
              <option value="">
                Select Category
              </option>

              {categories.map((cat) => (
                <option
                  key={cat.p_cata_id}
                  value={cat.p_cata_id}
                >
                  {cat.p_cata_name}
                </option>
              ))}
            </select>

            <select
              className="form-control mb-3"
              name="subcategory_id"
              value={formData.subcategory_id}
              onChange={handleChange}
            >
              <option value="">
                Select Subcategory
              </option>

              {subCategories.map((sub) => (
                <option
                  key={sub.p_sub_cata_id}
                  value={sub.p_sub_cata_id}
                >
                  {sub.p_sub_cata_name}
                </option>
              ))}
            </select>

            <textarea
              className="form-control mb-3"
              name="description"
              placeholder="Short Description"
              onChange={handleChange}
            />

            <textarea
              className="form-control mb-3"
              name="long_description"
              placeholder="Long Description"
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              type="file"
              onChange={handleFile}
            />

            <button
              type="submit"
              style={primaryButton}
            >
              Add Product
            </button>
          </form>
        </div>

        {/* MANAGE PRODUCT */}
        <div
          style={{
            background: "white",
            width: "100%",
maxWidth: "1400px",
            borderRadius: "20px",
            padding: "30px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.12)",
          }}
        >
          <h2
            style={{
              marginBottom: "25px",
              fontWeight: "700",
            }}
          >
            Manage Product
          </h2>

          <input
            className="form-control mb-3"
            placeholder="Enter Product ID"
            value={searchId}
            onChange={(e) =>
              setSearchId(e.target.value)
            }
          />

          <button
            onClick={searchProduct}
            style={searchButton}
          >
            Search Product
          </button>

          {product && (
            <div
              style={{
                marginTop: "30px",
                background: "#f8f9fa",
                padding: "25px",
                borderRadius: "15px",
              }}
            >
              <input
                className="form-control mb-3"
                value={product.product_name}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    product_name:
                      e.target.value,
                  })
                }
                placeholder="Product Name"
              />

              <textarea
                className="form-control mb-3"
                value={
                  product.product_description
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    product_description:
                      e.target.value,
                  })
                }
                placeholder="Description"
              />

              <textarea
                className="form-control mb-3"
                value={
                  product.long_description
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    long_description:
                      e.target.value,
                  })
                }
                placeholder="Long Description"
              />

              <input
                type="number"
                className="form-control mb-3"
                value={
                  product.product_price
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    product_price:
                      e.target.value,
                  })
                }
                placeholder="Price"
              />

              <button
                onClick={updateProduct}
                style={updateButton}
              >
                Update Product
              </button>

              <button
                onClick={deleteProduct}
                style={deleteButton}
              >
                Delete Product
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const primaryButton = {
  background:
    "linear-gradient(135deg,#007bff,#0056d2)",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
  marginRight: "12px",
};

const searchButton = {
  background:
    "linear-gradient(135deg,#17a2b8,#11707f)",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

const updateButton = {
  background:
    "linear-gradient(135deg,#28a745,#1e7e34)",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
  marginRight: "12px",
};

const deleteButton = {
  background:
    "linear-gradient(135deg,#dc3545,#b02a37)",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

export default ProductDetails;