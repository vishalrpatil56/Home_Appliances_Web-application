import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "./Style/Header1.css";
import { FiLogOut } from "react-icons/fi";

const Header1 = () => {
  const [productDropdown, setProductDropdown] = useState(false);
  const [ordersDropdown, setOrdersDropdown] = useState(false);
  const [complainDropdown, setComplainDropdown] = useState(false);
  const [feedbackDropdown, setFeedbackDropdown] = useState(false);

  const timeoutRef = useRef(null);

  // KEEP DROPDOWN OPEN
  const handleMouseEnter = (setter) => {
    clearTimeout(timeoutRef.current);
    setter(true);
  };

  // DELAY CLOSE
  const handleMouseLeave = (setter) => {
    timeoutRef.current = setTimeout(() => {
      setter(false);
    }, 300);
  };

  // MENU STYLE
  const dropdownMenuStyle = {
    background: "rgba(15,15,15,0.92)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "12px",
    minWidth: "240px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
    marginTop: "0px",
    top: "100%",
    position: "absolute",
    animation: "fadeDown 0.3s ease",
  };

  // ITEM STYLE
  const itemStyle = {
    color: "white",
    borderRadius: "12px",
    padding: "13px 18px",
    transition: "all 0.3s ease",
    fontWeight: "500",
    background: "transparent",
    marginBottom: "5px",
  };

  // NAV STYLE
  const navStyle = {
    fontWeight: "600",
    transition: "0.3s",
    letterSpacing: "0.5px",
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeDown {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0px);
            }
          }

          .dropdown-toggle::after {
            margin-left: 8px;
            vertical-align: middle;
          }

          .nav-link:hover {
            color: orange !important;
            text-shadow: 0 0 12px orange;
          }
        `}
      </style>

      <header>
        <nav
          className="navbar navbar-expand-lg navbar-dark"
          style={{
            background: "black",
            padding: "15px 25px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <div className="container-fluid">

            {/* LOGO */}
            <Link to="/serviceproviderdash">
              <img
                src="http://54.84.125.102:5000/uploads/Untitled design.jpeg"
                alt="logo"
                style={{
                  width: "220px",
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
              />
            </Link>

            {/* NAVBAR */}
            <div className="collapse navbar-collapse justify-content-end">
              <ul
                className="navbar-nav"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
              >

                {/* HOME */}
                <li className="nav-item">
                  <Link
                    className="nav-link active text-white px-2"
                    to="/serviceproviderdash"
                    style={navStyle}
                  >
                    HOME
                  </Link>
                </li>

                {/* PRODUCT */}
                <li
                  style={{ position: "relative" }}
                  onMouseEnter={() =>
                    handleMouseEnter(setProductDropdown)
                  }
                  onMouseLeave={() =>
                    handleMouseLeave(setProductDropdown)
                  }
                >
                  <Dropdown show={productDropdown}>
                    <Dropdown.Toggle
                      className="nav-link bg-black border-0 text-white"
                      style={navStyle}
                    >
                      PRODUCT
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={dropdownMenuStyle}
                      onMouseEnter={() =>
                        handleMouseEnter(setProductDropdown)
                      }
                      onMouseLeave={() =>
                        handleMouseLeave(setProductDropdown)
                      }
                    >
                      <Dropdown.Item
                        as={Link}
                        to="/serviceproviderdash/productdetails"
                        style={itemStyle}
                        onMouseEnter={(e) => {
                          e.target.style.background = "orangered";
                          e.target.style.transform =
                            "translateX(6px)";
                          e.target.style.boxShadow =
                            "0 0 15px rgba(255,69,0,0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background =
                            "transparent";
                          e.target.style.transform =
                            "translateX(0px)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        Product Details
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>

                {/* PRODUCT ORDERS */}
                <li
                  style={{ position: "relative" }}
                  onMouseEnter={() =>
                    handleMouseEnter(setOrdersDropdown)
                  }
                  onMouseLeave={() =>
                    handleMouseLeave(setOrdersDropdown)
                  }
                >
                  <Dropdown show={ordersDropdown}>
                    <Dropdown.Toggle
                      className="nav-link bg-black border-0 text-white"
                      style={navStyle}
                    >
                      PRODUCT ORDERS
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={dropdownMenuStyle}
                      onMouseEnter={() =>
                        handleMouseEnter(setOrdersDropdown)
                      }
                      onMouseLeave={() =>
                        handleMouseLeave(setOrdersDropdown)
                      }
                    >
                      <Dropdown.Item
                        as={Link}
                        to="/serviceproviderdash/customerorders"
                        style={itemStyle}
                        onMouseEnter={(e) => {
                          e.target.style.background = "orangered";
                          e.target.style.transform =
                            "translateX(6px)";
                          e.target.style.boxShadow =
                            "0 0 15px rgba(255,69,0,0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background =
                            "transparent";
                          e.target.style.transform =
                            "translateX(0px)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        Product Orders
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>

                {/* COMPLAIN */}
                <li
                  style={{ position: "relative" }}
                  onMouseEnter={() =>
                    handleMouseEnter(setComplainDropdown)
                  }
                  onMouseLeave={() =>
                    handleMouseLeave(setComplainDropdown)
                  }
                >
                  <Dropdown show={complainDropdown}>
                    <Dropdown.Toggle
                      className="nav-link bg-black border-0 text-white"
                      style={navStyle}
                    >
                      COMPLAIN
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={dropdownMenuStyle}
                      onMouseEnter={() =>
                        handleMouseEnter(setComplainDropdown)
                      }
                      onMouseLeave={() =>
                        handleMouseLeave(setComplainDropdown)
                      }
                    >
                      <Dropdown.Item
                        as={Link}
                        to="/serviceproviderdash/serviceprovidercomplain"
                        style={itemStyle}
                        onMouseEnter={(e) => {
                          e.target.style.background = "orangered";
                          e.target.style.transform =
                            "translateX(6px)";
                          e.target.style.boxShadow =
                            "0 0 15px rgba(255,69,0,0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background =
                            "transparent";
                          e.target.style.transform =
                            "translateX(0px)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        Customer Complains
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>

                {/* FEEDBACK */}
                <li
                  style={{ position: "relative" }}
                  onMouseEnter={() =>
                    handleMouseEnter(setFeedbackDropdown)
                  }
                  onMouseLeave={() =>
                    handleMouseLeave(setFeedbackDropdown)
                  }
                >
                  <Dropdown show={feedbackDropdown}>
                    <Dropdown.Toggle
                      className="nav-link bg-black border-0 text-white"
                      style={navStyle}
                    >
                      FEEDBACK
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      style={dropdownMenuStyle}
                      onMouseEnter={() =>
                        handleMouseEnter(setFeedbackDropdown)
                      }
                      onMouseLeave={() =>
                        handleMouseLeave(setFeedbackDropdown)
                      }
                    >
                      <Dropdown.Item
                        as={Link}
                        to="/serviceproviderdash/serviceproviderfeedback"
                        style={itemStyle}
                        onMouseEnter={(e) => {
                          e.target.style.background = "orangered";
                          e.target.style.transform =
                            "translateX(6px)";
                          e.target.style.boxShadow =
                            "0 0 15px rgba(255,69,0,0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background =
                            "transparent";
                          e.target.style.transform =
                            "translateX(0px)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        Customer Feedback
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>

                {/* LOGOUT */}
                <li className="nav-item">
                  <Link className="nav-link" to="/loginpage">
                    <FiLogOut
                      style={{
                        color: "red",
                        cursor: "pointer",
                      }}
                      size={30}
                    />
                  </Link>
                </li>

              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header1;