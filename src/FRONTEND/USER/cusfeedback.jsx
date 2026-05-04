import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CusHeader from "./CusHeader";
import CusFooter from "./CusFooter";
//import complainImage from "../assets/complain.jpg"; // Update path to your image

function Cusfeedback() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user_id = localStorage.getItem("user_id"); // Get logged-in user ID

    if (!user_id) {
        toast.error("You must be logged in to submit feedback!");
        return;
    }

    try {
        const response = await axios.post("http://54.84.125.102:5000/submit-feedback", { user_id, feedback });

        if (response.data.success) {
            toast.success("Feedback Submitted Successfully!", { position: "top-center" });
            setFeedback(""); // Clear input field
        } else {
            toast.error("Failed to submit feedback");
        }
    } catch (error) {
        console.error("Error submitting feedback:", error);
        toast.error("An error occurred. Please try again.");
    }
};


  return (
    <>
    <CusHeader/>
    <Container className="mt-5">
      <Row className="align-items-center">
        {/* Left Side - Image */}
        <Col md={6} className="text-center">
          <Image 
            src="http://54.84.125.102:5000/uploads/home.png"
            alt="Complain" 
            fluid 
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Col>

        {/* Right Side - Form */}
        <Col md={6}>
          <h2 className="mb-4 fw-bold">FEEDBACK :</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter Your Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              style={{ padding: "10px 20px" ,backgroundColor:"green" }}
            >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    <CusFooter />
     <ToastContainer />
    </>
  );
}

export default Cusfeedback;