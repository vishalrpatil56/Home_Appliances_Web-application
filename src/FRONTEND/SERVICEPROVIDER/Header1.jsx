import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "./Style/Header1.css";
import { FiLogOut } from "react-icons/fi";

const Header1 = () => {
 const [productDropdown, setProductDropdown] = useState(false);
const [ordersDropdown, setOrdersDropdown] = useState(false);
const [complainDropdown, setComplainDropdown] = useState(false);
const [feedbackDropdown, setFeedbackDropdown] = useState(false);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-black">
        <div className="container-fluid">

          {/* LOGO */}
          <Link to="/serviceproviderdash">
            <img
              src="http://54.84.125.102:5000/uploads/Untitled design.jpeg"  
              alt="logo"
              style={{ width: "250px", marginLeft: "25px" }}
            />
          </Link>

          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">

              {/* HOME */}
              <li className="nav-item">
                <Link className="nav-link active text-white px-3" to="/serviceproviderdash">
                  HOME
                </Link>
              </li>

              {/* PRODUCT */}
              <li
                onMouseEnter={() => setProductDropdown(true)}
                onMouseLeave={() => setProductDropdown(false)}
              >
                <Dropdown show={productDropdown}>
                  <Dropdown.Toggle className="nav-link bg-black border-0 text-white">
                    PRODUCT
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ backgroundColor: "#333" }}>
                    <Dropdown.Item
                      as={Link}
                      to="/serviceproviderdash/productdetails"
                      className="text-white"
                    >
                      Product Details
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>

              {/* PRODUCT ORDERS */}
              <li
                onMouseEnter={() => setOrdersDropdown(true)}
                onMouseLeave={() => setOrdersDropdown(false)}
              >
                <Dropdown show={ordersDropdown}>
                  <Dropdown.Toggle className="nav-link bg-black border-0 text-white">
                    PRODUCT ORDERS
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ backgroundColor: "#333" }}>
                    <Dropdown.Item
                      as={Link}
                      to="/serviceproviderdash/customerorders"
                      className="text-white"
                    >
                      Product Orders
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>

              {/* COMPLAIN */}
             {/* COMPLAIN */}
              <li
                className="nav-item"
                onMouseEnter={() => setComplainDropdown(true)}
                onMouseLeave={() => setComplainDropdown(false)}
              >
                <Dropdown show={complainDropdown}>
                  <Dropdown.Toggle className="nav-link bg-black border-0 text-white">
                    COMPLAIN
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ backgroundColor: "#333" }}>
                    <Dropdown.Item
                      as={Link}
                      to="/serviceproviderdash/serviceprovidercomplain"
                      className="text-white"
                    >
                      COMPLAIN
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>`

              {/* FEEDBACK */}
              <li
                onMouseEnter={() => setFeedbackDropdown(true)}
                onMouseLeave={() => setFeedbackDropdown(false)}
              >
                <Dropdown show={feedbackDropdown}>
                  <Dropdown.Toggle className="nav-link bg-black border-0 text-white">
                    FEEDBACK
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ backgroundColor: "#333" }}>
                    <Dropdown.Item
                      as={Link}
                      to="/serviceproviderdash/serviceproviderfeedback"
                      className="text-white"
                    >
                      Feedback
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>

              {/* LOGOUT */}
              <li className="nav-item">
                <Link className="nav-link" to="/loginpage">
                  <FiLogOut style={{ color: "red" }} size={30} />
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header1;