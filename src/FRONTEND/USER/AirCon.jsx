import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/AirCon.css"; // Create AirConditioners.css for styling
import CusFooter from "./CusFooter";
import CusHeader from "./CusHeader";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AirCon = () => {
  const navigate = useNavigate();
  const [splitACProducts, setSplitACProducts] = useState([]);
  const [windowACProducts, setWindowACProducts] = useState([]);

  useEffect(() => {
    const fetchSplitACs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/airconditioners/split"
        );
        setSplitACProducts(response.data);
      } catch (error) {
        console.error("Error fetching Split ACs:", error);
      }
    };

    const fetchWindowACs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/airconditioners/window"
        );
        setWindowACProducts(response.data);
      } catch (error) {
        console.error("Error fetching Window ACs:", error);
      }
    };

    fetchSplitACs();
    fetchWindowACs();
  }, []);
const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const cartItem = {
      id: product.product_id, // Unique ID
      image: `/AirConditioner/${product.product_image}`, // Full image URL
      name: product.product_name,
      description: product.product_description,
      price: product.product_price,
      quantity: 1, // Default quantity
    };
  
    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Your product is added to Cart successfully!",{position: "top-center"})
  };
  

  return (
    <>
      <CusHeader />

      {/* Split AC Section */}
      <div className="container my-3">
        <div className="row justify-content-center">
          <div className="card-body">
            <div className="card shadow-lg p-4">
              <h4
                style={{
                  padding: "20px",
                  borderRadius: "15px",
                  background: "#fff",
                  display: "inline-block",
                  fontWeight: "bold",
                }}
              >
                Split AC:
              </h4>
              <br />
              <br />
              <div className="row">
  {splitACProducts.map((product) => (
    <div
      className="col-lg-3 col-md-4 col-sm-6 mb-4"
      key={product.product_id}
    >
      <div
        className="product-card"
        onClick={() => navigate(`/product/${product.product_id}`)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={`/AirConditioner/${product.product_image}`}
          className="card-img"
          alt={product.product_name}
        />

        <div className="p-2">
          <p className="card-title">
            {product.product_description}
          </p>

          <div>
            <span className="fs-2">
              ₹{product.product_price}
            </span>
          </div>

          <button
            className="btn btn-warning w-100 mt-2"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
            </div>
          </div>
        </div>
      </div>

      {/* Window AC Section */}
      <div className="container my-3">
        <div className="row justify-content-center">
          <div className="card-body">
            <div className="card shadow-lg p-4">
              <h4
                style={{
                  padding: "20px",
                  borderRadius: "15px",
                  background: "#fff",
                  display: "inline-block",
                  fontWeight: "bold",
                }}
              >
                Window AC:
              </h4>
              <br />
              <br />
              <div className="row">
  {windowACProducts.map((product) => (
    <div
      className="col-lg-3 col-md-4 col-sm-6 mb-4"
      key={product.product_id}
    >
      <div
        className="product-card"
        onClick={() => navigate(`/product/${product.product_id}`)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={`/AirConditioner/${product.product_image}`}
          className="card-img"
          alt={product.product_name}
        />

        <div className="p-2">
          <p className="card-title">
            {product.product_description}
          </p>

          <div>
            <span className="fs-2">
              ₹{product.product_price}
            </span>
          </div>

          <button
            className="btn btn-warning w-100 mt-2"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
   
      <CusFooter />
    </>
  );
};

export default AirCon;
