
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Row,Col ,Container} from "react-bootstrap";
import { FaFacebook,FaInstagram } from "react-icons/fa";
import CusHeader from "./CusHeader";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Styles/Slideshow.css"
import CusFooter from "./CusFooter";



const slides = [
  {
    image: "Ac.png", // Replace with actual image path
    
    //description: "Top And Higher Quality Home Appliances",
  },
  {
    image: "Machine.png",
    
    //description: "Top And Higher Quality Home Appliances",
  },
  {
    image: "Tv.png",
    
    //description: "Top And Higher Quality Home Appliances",
  },
];
const categories = [
    { name: "Washing Machine", img: "washingmachine.png" , link:"/washing"},
    { name: "Air Conditioners", img: "air.png",link:"/aircon" },
    { name: "Refrigrators", img: "ref.png",link:"/fridge" },
    { name: "Telivisions", img: "tel.png",link:"/telivision" },
  { name: "RO Water Purifier", img: "ro.png", link:"/waterpurifier" }
    //  { name: "Irons", img: "iron.png" },
    // { name: "Water Heaters", img: "waterheater.png" },
    // { name: "Mixers", img: "/mixer.png" },
    // { name: "Vaccum Cleaners", img: "Vc.png" },
    // { name: "Deodorisers", img: "/images/deodoriser.png" },
  ];
const CusHome = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  const handleRedirect = (link) => {
    navigate(link); // Navigate to the linked page
  };
  const [hoveredCategory, setHoveredCategory] = useState('');
  return (
    <>
    <CusHeader/>
    <br />
    <div className="slideshow-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="custom-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="custom-slide">
            <img src={slide.image} alt={slide.title} className="slide-image" />
            <div className="slide-text">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <br />  
    </div>
    <br/>
    <div className="container mt-4">
      <h1 className="fw-bold">Featured Categories : </h1><br/><br />
      <div className="row row-cols-2 row-cols-md-4 g-4">
        {categories.map((category, index) => (
          <div className="col text-center" key={index} onClick={() => handleRedirect(category.link)} // Handle navigation on click
          style={{ cursor: "pointer" }}>
            
            <div className="category-card">
              
              <img src={category.img} alt={category.name} className="category-img" />
            </div>
            <h5 className="mt-2 fw-bold">{category.name}</h5>
            {category.subcategories && (
              <ul className="subcategory-list">
                {category.subcategories.map((sub, idx) => (
                  <li key={idx}>{sub}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
    <br /><br /><br /><br />
  <br /><br /><br /><br />
   
    <Container>
  <Row className="text-center text-md-start">
    {/* About Us Section */}
     {/* About Us Section */}
     <Col md={4} className="mb-4 fadeIn">
        <h1 className="fw-bold" style={{fontSize:"50px"}}>About us : </h1>
        <br />
          <p>
            We provide the best home appliance sales and repair services.
            Our expert technicians and premium products ensure customer
            satisfaction at the best prices.
          </p>
          <div style={{ marginTop: "20px" }}>
  <h3>Our Location</h3>

  <iframe
    src="https://www.google.com/maps?q=Green+Park+Nipani&output=embed"
    width="100%"
    height="300"
    style={{ border: 0, borderRadius: "12px" }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>
        </Col>

    {/* Contact Us Section */}
    <Col md={4} className="mb-4 ms-auto slideInRight">
  <h1 className="fw-bold" style={{ fontSize: "50px" }}>Contact us : </h1>

  <p><b><h3>Balaji Enterprise</h3></b></p>
  <p>Email: np65925603@gmail.com</p>
  <p>Phone: +91 9535345080, +91 8123892151</p>
  <p>Location: Green Park, Nipani</p>

  <br />

  {/* ✅ MOVE CARD HERE */}
  <div style={{
    marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    background: "#f8fafc",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
  }}>
    <h4 style={{ marginBottom: "10px" }}>🏠 Home Services Available</h4>

    <p style={{ margin: "5px 0" }}>
      <strong>Technicians:</strong><br />
      Nilesh Patil, Vikas Patil
    </p>

    <p style={{ margin: "5px 0" }}>
      <strong>Contact:</strong><br />
      8123892151, 7338121244
    </p>
  </div>

</Col>

   
  </Row>

<br /><br /><br /><br /><br /><br />

   {/* Complaint & Feedback Section */}
   {/* <Col md={4} className="mb-80 slideInLeft support-section"> */}
   {/* <Col md={4} className="mb-4 support-section"> */}
  <h1 className="fw-bold text-center support-title">Support :</h1>
  <br />
<div style={{ textAlign: "center", marginTop: "40px" }}>
  

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "30px",
      flexWrap: "wrap",
    }}
  >
    {/* Feedback Card */}
    <div
      onClick={() => navigate("/cusfeedback")}
      style={{
        width: "320px",
        padding: "25px",
        borderRadius: "14px",
        background: "#f0fdf4",   // soft green
        border: "1px solid #bbf7d0",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 15px 30px rgba(34,197,94,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 8px 25px rgba(0,0,0,0.06)";
      }}
    >
      <div style={{ fontSize: "30px", marginBottom: "10px" }}>💬</div>
      <h3 style={{ marginBottom: "8px", color: "#166534" }}>
        Give Feedback
      </h3>
      <p style={{ color: "#4b5563", fontSize: "14px" }}>
        Help us improve your experience
      </p>
    </div>

    {/* Complaint Card */}
    <div
      onClick={() => navigate("/cuscomplain")}
      style={{
        width: "320px",
        padding: "25px",
        borderRadius: "14px",
        background: "#fef2f2",   // soft red
        border: "1px solid #fecaca",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 15px 30px rgba(239,68,68,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 8px 25px rgba(0,0,0,0.06)";
      }}
    >
      <div style={{ fontSize: "30px", marginBottom: "10px" }}>⚠️</div>
      <h3 style={{ marginBottom: "8px", color: "#991b1b" }}>
        Register Complaint
      </h3>
      <p style={{ color: "#4b5563", fontSize: "14px" }}>
        Facing an issue? Let us know
      </p>
    </div>
  </div>
</div>
 
{/* </Col> */}
{/* </Col> */}

</Container>
    <br /><br />
     <CusFooter />
   
    </>
  );
};

export default CusHome;
