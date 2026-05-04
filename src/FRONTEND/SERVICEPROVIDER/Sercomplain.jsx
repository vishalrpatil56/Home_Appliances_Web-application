import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function SerComplain() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/usercomplainlist");
      setComplaints(res.data.complaints);
    } catch (error) {
      toast.error("Failed to load complaints");
    }
  };

  const markResolved = async (id) => {
    try {
      await axios.put(`http://localhost:5000/update-complaint-status/${id}`);
      toast.success("Marked as resolved");
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to update complaint");
    }
  };

  //  NEW DELETE FUNCTION
  const deleteComplaint = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-complaint/${id}`);
      toast.success("Complaint deleted");
      fetchComplaints();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Customer Complaints</h2>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>User</th>
            <th>Complaint</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.user_name}</td>
              <td>{c.message}</td>
              <td>{c.created_at}</td>
              <td>{c.status}</td>

              {/*  UPDATED ACTION COLUMN */}
              <td>
                {c.status !== "resolved" ? (
                  <button
                    className="btn btn-success"
                    onClick={() => markResolved(c.id)}
                  >
                    Resolve
                  </button>
                ) : (
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteComplaint(c.id)}
                  >
                    Delete
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SerComplain;