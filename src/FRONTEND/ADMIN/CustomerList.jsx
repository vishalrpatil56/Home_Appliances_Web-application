import { useEffect, useState } from "react";
import axios from "axios";
import "./Style/CustomerList.css";
import Header from "./Header";

const CustomerList = () => {

  const [customers, setCustomers] = useState([]);

  useEffect(() => {

    axios
      .get("http://54.84.125.102:5000/customerslist")
      .then((response) => setCustomers(response.data))
      .catch((error) =>
        console.error(
          "Error fetching customers:",
          error
        )
      );

  }, []);

  const deleteCustomer = async (userId) => {

    if (
      window.confirm(
        "Are you sure you want to delete this customer?"
      )
    ) {
      try {

        await axios.delete(
          `http://54.84.125.102:5000/customer/${userId}`
        );

        setCustomers(
          customers.filter(
            (customer) =>
              customer.user_id !== userId
          )
        );

      } catch (error) {

        console.error(
          "Error deleting customer:",
          error
        );

      }
    }
  };

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          background: "#f4f7fc",
          paddingTop: "120px",
          paddingRight: "40px",
          paddingBottom: "40px",
          paddingLeft: "340px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <h1
              style={{
                fontSize: "42px",
                fontWeight: "700",
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              Customer List
            </h1>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              overflow: "hidden",
              borderRadius: "15px",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(135deg,#007bff,#0056d2)",
                  color: "white",
                }}
              >
                <th style={thStyle}>ID</th>
                <th style={thStyle}>NAME</th>
                <th style={thStyle}>PHONE</th>
                <th style={thStyle}>EMAIL</th>
                <th style={thStyle}>PASSWORD</th>
                <th style={thStyle}>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.user_id}
                  style={{
                    borderBottom:
                      "1px solid #e5e5e5",
                  }}
                >
                  <td style={tdStyle}>
                    {customer.user_id}
                  </td>

                  <td style={tdStyle}>
                    {customer.user_name}
                  </td>

                  <td style={tdStyle}>
                    {customer.user_contact}
                  </td>

                  <td style={tdStyle}>
                    {customer.user_email}
                  </td>

                  <td style={tdStyle}>
                    {customer.password}
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() =>
                        deleteCustomer(
                          customer.user_id
                        )
                      }
                      style={{
                        background:
                          "linear-gradient(135deg,#dc3545,#b02a37)",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow:
                          "0 4px 12px rgba(220,53,69,0.3)",
                        transition: "0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform =
                          "translateY(-2px)";

                        e.target.style.boxShadow =
                          "0 6px 18px rgba(220,53,69,0.5)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform =
                          "translateY(0px)";

                        e.target.style.boxShadow =
                          "0 4px 12px rgba(220,53,69,0.3)";
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const thStyle = {
  padding: "18px",
  textAlign: "left",
  fontSize: "17px",
  fontWeight: "700",
};

const tdStyle = {
  padding: "20px",
  fontSize: "16px",
  fontWeight: "500",
};

export default CustomerList;