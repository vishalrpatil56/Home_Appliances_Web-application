import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { RiShoppingBag3Line } from "react-icons/ri";
import "./Styles/CusHeader.css";

function CusHeader({ cartCount = 0 }) {
  const [searchTerm, setSearchTerm] = useState("");
 const navigate = useNavigate();

  // Handle search and redirect to results page
  const handleSearch = () => {
  const search = searchTerm.toLowerCase().trim();

  if (search.includes("washing")) {
    navigate("/washing");
  } 
  else if (
    search.includes("ac") ||
    search.includes("air")
  ) {
    navigate("/aircon");
  } 
  else if (search.includes("fridge")) {
    navigate("/fridge");
  } 
  else if (
    search.includes("tv") ||
    search.includes("television")
  ) {
    navigate("/telivision");
  } 
  else if (
    search.includes("water") ||
    search.includes("purifier")
  ) {
    navigate("/waterpurifier");
  } 
  else {
    alert("No matching products found");
  }
};

  // Trigger search on "Enter" key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-black">
        <div className="container-fluid">
          <div
            className="collapse navbar-collapse"
            id="navbarNav"
          >
            {/* Logo */}
            <Link to={"/"}>
              {" "}
              <img
                src="http://54.84.125.102:5000/uploads/Untitled design.jpeg"
                alt="logo"
                className="me-3"
                style={{
  width: "180px",
  marginLeft: "10px",
  height: "auto"
}}
              />
            </Link>

     {/* Tagline */}
     <div
              className="header-tagline"
              style={{
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                padding: "10px 20px",
                borderRadius: "8px",
                boxShadow: "0 0 15px rgba(255,140,0,0.8)",
                animation: "pulse 1.5s infinite alternate",
                transition: "all 0.3s ease-in-out",
                minWidth: "500px",
textAlign: "center",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "white";
                e.target.style.boxShadow = "0 0 20px rgba(255,140,0,1)";
                /*e.target.style.transform = "scale(1.05)";*/
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "white";
                e.target.style.boxShadow = "0 0 15px rgba(255,140,0,0.8)";
               /* e.target.style.transform = "scale(1)";*/
              }}
            >
              Your Trusted Home Appliance Partner
            </div>
            {/* Search Container */}
            
<div
  style={{
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: "50px",
    overflow: "hidden",
    width: "220px",
    height: "42px",
    marginLeft: "80px",
    boxShadow: "0 0 10px rgba(255,140,0,0.5)",
    border: "1px solid #ddd",
  }}
>
  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={handleKeyPress}
    style={{
      border: "none",
      outline: "none",
      padding: "10px 15px",
      flex: 1,
      fontSize: "14px",
      backgroundColor: "transparent",
    }}
  />

  <button
    onClick={handleSearch}
    style={{
      border: "none",
      backgroundColor: "orangered",
      color: "white",
      width: "45px",
      height: "100%",
      cursor: "pointer",
      borderTopRightRadius: "50px",
borderBottomRightRadius: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "0.3s",
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = "tomato";
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = "orangered";
    }}
  >
    <FiSearch size={18} />
  </button>
</div>

            {/* Orders Link */}

            {/* Navigation Links */}
            <ul
  className="navbar-nav ms-auto"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "5px",
  }}
>
              <li className="nav-item">
                <Link
                  className="nav-link active text-white px-3"
                  to="/loginpage"
                  style={{
                    backgroundColor: "orangered",
                    marginTop: "5px",
                    color: "white",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    margin: "5px",
                    transition:
                      "box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease", // Added box-shadow transition
                    marginRight: "40px",
                    boxShadow: "0 0 10px rgba(255, 69, 0, 0.8)", // Initial glow
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "tomato";
                    e.target.style.color = "yellow";
                    e.target.style.boxShadow = "0 0 15px rgba(255, 69, 0, 1)"; // Increased glow on hover
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "orangered";
                    e.target.style.color = "white";
                    e.target.style.boxShadow = "0 0 10px rgba(255, 69, 0, 0.5)"; // Return to initial glow
                  }}
                >
                  Be A Service Provider
                </Link>
              </li>{" "}
              <li className="nav-item">
                <Link
                  className="nav-link active text-white px-3"
                  to="/orders"
                  style={{ transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "yellow";
                    e.target.style.transform = "scale(1.2)";
                    e.target.style.textShadow = "0 0 20px yellow";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "white";
                    e.target.style.transform = "scale(1)";
                    e.target.style.textShadow = "none";
                  }}
                >
                  <RiShoppingBag3Line size={30} />
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active text-white px-3"
                  to="/cart"
                  style={{ transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "yellow";
                    e.target.style.transform = "scale(1.2)";
                    e.target.style.textShadow = "0 0 20px yellow";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "white";
                    e.target.style.transform = "scale(1)";
                    e.target.style.textShadow = "none";
                  }}
                >
                  <AiOutlineShoppingCart size={30} />
                  {cartCount > 0 && (
                    <span className="cart-badge">
                      {cartCount > 1 ? "1+" : "1"}
                    </span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active text-white px-3"
                  to="/userregister"
                  style={{ transition: "all 0.3s ease" }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "yellow";
                    e.target.style.transform = "scale(1.2)";
                    e.target.style.textShadow = "0 0 20px yellow";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "white";
                    e.target.style.transform = "scale(1)";
                    e.target.style.textShadow = "none";
                  }}
                >
                  <FiUser size={33} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default CusHeader;
