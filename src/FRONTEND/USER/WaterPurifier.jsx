import React, { useEffect, useState } from "react";
import axios from "axios";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import { useNavigate } from "react-router-dom";
import "./Styles/WaterPurifier.css";

// Toast
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function WaterPurifier() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/waterpurifiers")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
  console.log(err);
  toast.error("Failed to load products");
});
  }, []);

  const handleAddToCart = (p, e) => {
    e.stopPropagation();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
      id: p.product_id,
      image: `http://localhost:5000/uploads/${p.product_image}`,
      name: p.product_name,
      price: p.product_price,
      quantity: 1,
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    toast.success("Your product is added to Cart successfully!", {
      position: "top-center",
    });
  };

  return (
    <>
      <CusHeader />

      <div className="container my-3">
        <div className="row justify-content-center">
          <div className="card-body">
            <div className="card shadow-lg p-4">

              {/* Heading */}
              <h4
                style={{
                  padding: "20px",
                  borderRadius: "15px",
                  background: "#fff",
                  display: "inline-block",
                  fontWeight: "bold",
                }}
              >
                RO Water Purifier:
              </h4>

              <br />
              <br />

              {/* ✅ GRID FIX (IMPORTANT) */}
              <div className="row">
                {products.map((p) => (
                  <div
                    className="col-lg-3 col-md-4 col-sm-6 mb-4"
                    key={p.product_id}
                  >
                    <div
                      className="product-card"
                      onClick={() =>
                        navigate(`/product/${p.product_id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={`http://localhost:5000/uploads/${p.product_image}`}
                        className="card-img"
                        alt={p.product_name}
                      />

                      <div className="p-2">
                        <h6 className="card-title">
                          {p.product_description}
                        </h6>

                        <div>
                          <span className="fs-2">
                            ₹{p.product_price}
                          </span>
                        </div>

                        <button
                          className="btn btn-warning w-100 mt-2"
                          onClick={(e) => handleAddToCart(p, e)}
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

      
      <CusFooter />
    </>
  );
}

export default WaterPurifier;