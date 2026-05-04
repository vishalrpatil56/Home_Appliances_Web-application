import React from "react";
import Header from "./Header";
import "./Style/Home.css";

function Home() {
  return (
    <>
      <Header />

      <div className="main-content">
        <div className="home-wrapper">
          
          {/* ONLY IMAGE */}
          <div className="home-image-full">
            <img src="http://54.84.125.102:5000/uploads/6424688.webp" alt="dashboard" />
          </div>

        </div>
      </div>
    </>
  );
}

export default Home;