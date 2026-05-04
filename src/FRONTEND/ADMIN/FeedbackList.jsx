import { useEffect, useState } from "react";
import axios from "axios";
import "./Style/FeedbackList.css"; 
import Header from "./Header";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/feedbacklist")
      .then((response) => setFeedbacks(response.data))
      .catch((error) => console.error("Error fetching feedbacks:", error));
  },); 
  return (<>
    <Header/>
    <div className="main-content">
      <div className="table-wrapper">
        <h1 style={{ fontWeight: "bolder", fontFamily: "serif" }}>
          Feedback List :
        </h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
<th>Feedback</th>
<th>Customer ID</th>
              <th></th>
            </tr>
          </thead>
        <tbody>
  {feedbacks.map((f) => (
    <tr key={f.feedback_id}>
      <td>{f.feedback_id}</td>
      <td>{f.feedback_text}</td>
      <td>{f.customer_id}</td>

      <td>
        👍 💬 ✅
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

export default FeedbackList;