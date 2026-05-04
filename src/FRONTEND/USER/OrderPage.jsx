import React, { useEffect, useState } from "react";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBox, FaTrash, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch from DB
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/get-orders");
      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Search filter (DB field)
  const filteredOrders = orders.filter((order) =>
  String(order.order_date)
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);

  // ✅ Delete from DB (NOT localStorage)
  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(
        `http://localhost:5000/delete-order/${orderId}`
      );
      toast.success("Order deleted successfully!");
      fetchOrders(); // refresh list
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  return (
    <>
      <CusHeader />

      <div className="container my-5">
        <h2 className="text-center mb-4">📦 Your Orders</h2>

        {/* Search */}
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search orders by date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-primary">
            <FaSearch />
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="alert alert-info text-center">
            No orders found
          </div>
        ) : (
          filteredOrders.map((order) => (
  <div key={order.order_id} className="card mb-4 shadow-sm border-0">
    <div className="card-body">

      <div className="d-flex justify-content-between">
        <h5>
          Order ID: {order.order_id}
        </h5>
        <small>{order.order_date}</small>
      </div>

      <hr />

      <h6 className="text-success">Customer Info:</h6>
      <p><strong>Name:</strong> {order.name}</p>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Phone:</strong> {order.phone}</p>
      <p><strong>Address:</strong> {order.address}</p>

      <h6 className="text-info mt-3">Product Info:</h6>
     
<p><strong>Price:</strong> ₹{order.product_price || order.total_price}</p>
      <p><strong>Quantity:</strong> {order.quantity}</p>

      <h5 className="text-end text-primary">
        Total: ₹{order.total_price}
      </h5>

      <div className="text-end">
        <button
          className="btn btn-outline-danger"
          onClick={() => deleteOrder(order.order_id)}
        >
          Delete
        </button>
      </div>

    </div>
  </div>
))
        )}
      </div>

      <ToastContainer />
      <CusFooter />
    </>
  );
};

export default Orders;