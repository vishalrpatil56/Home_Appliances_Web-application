import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";


const ProductDetails = () => {
  const [categories, setCategories] = useState([]);
const [subCategories, setSubCategories] = useState([]);

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
  const [newPrice, setNewPrice] = useState("");

  // Load categories
  useEffect(() => {
    axios.get("http://54.84.125.102:5000/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.log(err));
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Category change
 const handleCategoryChange = async (e) => {
  const categoryId = e.target.value;

  // 🚨 STOP if empty
  if (!categoryId) return;

  setFormData({
    ...formData,
    category_id: categoryId,
    subcategory_id: ""
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

  // ADD PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("long_description", formData.long_description);
    data.append("price", formData.price);
    data.append("subcategory_id", formData.subcategory_id);
    data.append("image", formData.image);

    try {
      await axios.post("http://54.84.125.102:5000/add-product", data);
      toast.success("Product added successfully!");
    } catch (err) {
      toast.error("Error adding product");
    }
  };

  // SEARCH PRODUCT
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

  // UPDATE PRICE
  const updatePrice = async () => {
    await axios.put(
      `http://54.84.125.102:5000/api/update-product-price/${searchId}`,
      { price: newPrice }
    );
    toast.info("Price updated successfully!");
    searchProduct();
  };

  // DELETE PRODUCT
  const deleteProduct = async () => {
    await axios.delete(
      `http://54.84.125.102:5000/api/delete-product/${searchId}`
    );
    toast.error("Product deleted successfully!");
    setProduct(null);
  };

  return (
    <div className="container mt-5">

      {/* ADD PRODUCT */}
      <div className="card p-4 mb-4">
        <h3>Add Product</h3>

        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" name="name" placeholder="Name" onChange={handleChange} required />

          <select
            className="form-control mb-2"
            onChange={handleCategoryChange}
            value={formData.category_id}
          >
            <option value="">Select Category</option>

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
  className="form-control mb-2"
  name="subcategory_id"
  value={formData.subcategory_id}
  onChange={handleChange}
>
  <option value="">Select Subcategory</option>

  {subCategories.map((sub) => (
    <option
      key={sub.p_sub_cata_id}
      value={sub.p_sub_cata_id}
    >
      {sub.p_sub_cata_name}
    </option>
  ))}
</select>

          <textarea className="form-control mb-2" name="description" placeholder="Short Description" onChange={handleChange} />

          <textarea className="form-control mb-2" name="long_description" placeholder="Long Description" onChange={handleChange} />

          <input className="form-control mb-2" type="number" name="price" placeholder="Price" onChange={handleChange} />

          <input className="form-control mb-2" type="file" onChange={handleFile} />

          <button className="btn btn-success">Add Product</button>
        </form>
      </div>

      {/* MANAGE PRODUCT */}
      <div className="card p-4">
        <h3>Manage Product</h3>

        <input
          className="form-control mb-2"
          placeholder="Enter Product ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <button className="btn btn-primary mb-2" onClick={searchProduct}>
          Search
        </button>

        {product && (
          <>
            <p><b>{product.product_name}</b></p>
            <p>₹{product.product_price}</p>

            <input
              className="form-control mb-2"
              placeholder="New Price"
              onChange={(e) => setNewPrice(e.target.value)}
            />

            <button className="btn btn-warning me-2" onClick={updatePrice}>
              Update Price
            </button>

            <button className="btn btn-danger" onClick={deleteProduct}>
              Delete
            </button>
          </>
        )}
      </div>

    </div>
  );
};

export default ProductDetails;