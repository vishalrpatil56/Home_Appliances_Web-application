import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
// import Header1 from "./Header1";
// import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";

function Cuscomplain() {
  const [complain, setComplain] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:5000/api/complaint", {
      complain_text: complain // ✅ FIXED (use complain)
    });

    console.log("SUCCESS:", response.data);

    toast.success("Complaint submitted successfully!");

    setComplain(""); // ✅ reset field

  } catch (error) {
    console.error("ERROR:", error);
    toast.error("Failed to submit complaint");
  }
};

  return (
    <>
      <CusHeader />
      <Container className="mt-5">
        <Row className="align-items-center">
          {/* Left Side - Image */}
          <Col md={6} className="text-center">
            <Image
              src="home.png"
              alt="Complain"
              fluid
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Col>

          {/* Right Side - Form */}
          <Col md={6}>
            <h2 className="mb-4 fw-bold">COMPLAIN :</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter Your Complain"
                  value={complain}
                  onChange={(e) => setComplain(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                style={{ padding: "10px 20px", backgroundColor: "red" }}
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      {/* <Footer/> */}
      <CusFooter />
        <ToastContainer />
    </>
  );
}

export default Cuscomplain;
