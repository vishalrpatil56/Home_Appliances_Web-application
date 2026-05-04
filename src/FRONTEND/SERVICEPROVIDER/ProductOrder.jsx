import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBox,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DownloadInvoice from "./DownloadReport";

const Mainorders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

 useEffect(() => {
  fetchOrders();
}, []);

const fetchOrders = async () => {
  try {
    const res = await fetch("http://54.84.125.102:5000/get-orders");
    const data = await res.json();

    // ✅ GROUP BY ORDER ID
    const grouped = {};

    data.orders.forEach((o) => {
      if (!grouped[o.order_group_id]) {
  grouped[o.order_group_id] = {
    id: o.order_group_id,      // 👈 use group id
    date: o.order_date,
    total: o.total_price,
    customer: {
      name: o.name,
      email: o.email,
      phone: o.phone,
      address: o.address,
    },
    products: [],
  };
}

if (o.product_name) {
  grouped[o.order_group_id].products.push({
    name: o.product_name,
    price: o.product_price,
    quantity: o.quantity,
  });
}
    });

    // Convert object to array
    setOrders(Object.values(grouped));

  } catch (err) {
    console.log(err);
  }
};

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

 const deleteOrder = async (orderId) => {
  try {
    await fetch(`http://54.84.125.102:5000/delete-order/${orderId}`, {
      method: "DELETE",
    });

    toast.success("Order deleted successfully!");

    // refresh orders
    fetchOrders();
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">📦 Customer Orders</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info text-center">
          No orders found 😊
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-4 shadow-sm border-0">
            <div className="card-body">

              <div className="d-flex justify-content-between">
                <h5>
                  <FaBox className="text-primary me-2" />
                  Order ID: {order.id}
                </h5>
                <small>{order.date}</small>
              </div>

              <hr />

              {/* Customer Info */}
              <h6 className="text-success">Customer Info:</h6>
              <p><strong>Name:</strong> {order.customer?.name}</p>
              <p><strong>Email:</strong> {order.customer?.email}</p>
              <p><strong>Phone:</strong> {order.customer?.phone}</p>
              <p><strong>Address:</strong> {order.customer?.address}</p>

              {/* Buttons */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                
                

                <div>
                  <DownloadInvoice order={order} />

                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deleteOrder(order.id)}
                  >
                    <FaTrash className="me-1" /> Delete
                  </button>
                </div>

              </div>

            

              {/* Total */}
              <h5 className="text-end mt-3">
                Total: <span className="text-primary">₹{order.total}</span>
              </h5>

            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Mainorders;