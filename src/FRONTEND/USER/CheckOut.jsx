import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CusHeader from "./CusHeader";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const CheckOut = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    paymentMethod: "",
  });

  const navigate = useNavigate();

  // ✅ LOAD CART
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // ✅ TOTAL PRICE
  const getTotalPrice = () => {
  return cart.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);
};

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ ONLINE PAYMENT (RAZORPAY)
  const handleOnlinePayment = async () => {
    try {
      const res = await axios.post(
        "http://54.84.125.102:5000/api/payment/create-order",
        {
          amount: getTotalPrice(),
        }
      );

      const options = {
        key: "rzp_test_SgPSwKkrO0I17f",
        amount: res.data.amount,
        currency: "INR",
        name: "Balaji Enterprises",
        description: "Order Payment",
        order_id: res.data.id,

        handler: async function (response) {
          try {
            // ✅ SAVE ORDER TO DB (FIXED)
            await axios.post("http://54.84.125.102:5000/place-order", {
              customer_id: 1, // replace with logged user if available
               products: cart.map(item => ({
    product_id: item.product_id || item.id,
    name: item.name,
   price: Number(item.price),
    quantity: item.quantity || 1
  })),
  total_price: getTotalPrice(),

              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
            });

            toast.success("Order placed successfully ✅");

            localStorage.removeItem("cart");
            setCart([]);

            navigate("/orders");
          } catch (error) {
            console.log(error);
            toast.error("Failed to save order");
          }
        },

        prefill: {
          name: formData.name || "Customer",
          email: formData.email || "test@gmail.com",
          contact: formData.phone || "9999999999",
        },

        theme: {
          color: "#f37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      toast.error("Payment Failed");
    }
  };

  // ✅ CHECKOUT
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.phone ||
      !formData.paymentMethod
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Enter valid phone number");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // ✅ ONLINE PAYMENT
    if (formData.paymentMethod === "online") {
      await handleOnlinePayment();
      return;
    }

    // ✅ COD / CARD (DIRECT SAVE)
    try {
      await axios.post("http://54.84.125.102:5000/place-order", {
        customer_id: 1,
         products: cart.map(item => ({
    product_id: item.product_id || item.id,
    name: item.name,
    price: Number(item.price),
    quantity: item.quantity || 1
  })),
  total_price: getTotalPrice(),

        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      toast.success("Order placed successfully ✅");

      localStorage.removeItem("cart");
      setCart([]);

      navigate("/orders");
    } catch (error) {
      console.log(error);
      toast.error("Order failed");
    }
  };

  return (
    <>
      <CusHeader />

      <div className="container my-5">
        <h2 className="text-center mb-4">🛒 Checkout</h2>

        {cart.length === 0 ? (
          <div className="alert alert-warning text-center">
            Your cart is empty!
          </div>
        ) : (
          <div className="row">
            {/* LEFT */}
            <div className="col-lg-6">
              <div className="card p-4 shadow">
                <h4>Customer Info</h4>

                <form onSubmit={handleCheckout}>
                  <input
                    className="form-control mb-3"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <input
                    className="form-control mb-3"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <input
                    className="form-control mb-3"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <textarea
                    className="form-control mb-3"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                  />

                  <select
                    className="form-control mb-3"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="">Select Payment</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="card">Card</option>
                    <option value="online">Online Payment</option>
                  </select>

                  {/* ✅ FIXED BUTTON */}
                  <button type="submit" className="btn btn-success">
                    Place Order
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-lg-6">
              <div className="card p-4 shadow">
                <h4>Order Summary</h4>

                {cart.map((item, i) => (
                  <div key={i} className="d-flex justify-content-between">
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}

                <hr />
                <h5>Total: ₹{getTotalPrice().toFixed(2)}</h5>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </>
  );
};

export default CheckOut;