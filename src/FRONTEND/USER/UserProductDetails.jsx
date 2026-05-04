import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";


function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState("");
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const handleAddToCart = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartItem = {
    id: product.product_id,
    image: `http://localhost:5000/uploads/${selectedImage}`, // ✅ FIXED
    name: product.product_name,
    description: product.product_description,
    price: product.product_price,
    quantity: 1,
  };

  cart.push(cartItem);

  localStorage.setItem("cart", JSON.stringify(cart));

  toast.success("Your product is added to Cart successfully!");
};

useEffect(() => {
  axios
    .get(`http://localhost:5000/api/product/${id}`)
    .then((res) => {
      console.log("DATA:", res.data);

      setProduct(res.data);

      if (res.data.images && res.data.images.length > 0) {
        setSelectedImage(res.data.images[0].image_url);
      } else {
        // fallback if no images
        setSelectedImage(res.data.product_image);
      }
    })
    .catch((err) => console.log(err));
}, [id]);
 

  if (!product) return <h2>Loading...</h2>;

  return (
    <>
      <CusHeader />

      <div style={{ padding: "40px", background: "#f5f5f5" }}>
        <div
          style={{
            display: "flex",
            gap: "40px",
            background: "#fff",
            padding: "30px",
            borderRadius: "10px",
          }}
        >
          {/* LEFT IMAGE */}
          <div>
  {/* MAIN IMAGE */}
  <img
 src={
  selectedImage
    ? `http://localhost:5000/uploads/${selectedImage}`
    : "https://via.placeholder.com/300"
}
  style={{ width: "300px", borderRadius: "10px" }}
/>

  {/* THUMBNAILS */}
  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
    {product.images &&
      product.images.map((img, index) => (
        <img
          key={index}
          src={`http://localhost:5000/uploads/${img.image_url}`}
          style={{
            width: "60px",
            cursor: "pointer",
            border:
              selectedImage === img.image_url
                ? "2px solid orange"
                : "1px solid #ccc",
            borderRadius: "5px",
          }}
          onClick={() => setSelectedImage(img.image_url)}
        />
      ))}
  </div>
</div>

          {/* RIGHT DETAILS */}
          <div>
            <h2>{product.product_name}</h2>
            <h3 style={{ color: "#007bff" }}>
              ₹{product.product_price}
            </h3>

            <p style={{ marginTop: "10px", color: "#555" }}>
              {product.long_description}
            </p>

            <button
  onClick={handleAddToCart}
  style={{
    background: "#ff9800",
    color: "#000",
    border: "none",
    padding: "12px 25px",
    borderRadius: "5px",
    marginTop: "15px",
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  Add to Cart
</button>
          </div>
        </div>
      </div>

      <CusFooter />
    </>
  );
}

export default ProductDetails;