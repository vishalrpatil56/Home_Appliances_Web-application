import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function SerFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/serviceprovider-feedback-list");
      setFeedbacks(res.data.feedbacks);
    } catch (error) {
      toast.error("Failed to load feedbacks");
    }
  };

  //  DELETE FUNCTION
  const deleteFeedback = async (id) => {
   

    try {
      await axios.delete(`http://localhost:5000/delete-feedback/${id}`);
      toast.success("Feedback deleted");
      fetchFeedbacks();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Customer Feedbacks</h2>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>User</th>
            <th>Feedback</th>
            <th>Date</th>
            <th>Action</th> {/* ✅ NEW COLUMN */}
          </tr>
        </thead>

        <tbody>
          {feedbacks.map((f) => (
            <tr key={f.feedback_id}>
              <td>{f.user_name}</td>
              <td>{f.feedback_text}</td>
              <td>{f.created_at}</td>

              {/*  DELETE BUTTON */}
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteFeedback(f.feedback_id)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SerFeedback;