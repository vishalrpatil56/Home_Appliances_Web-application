import { useEffect, useState } from "react";
import axios from "axios";
import "./Style/ComplainList.css";
import Header from "./Header";



const ComplainList = () => {
  const [Complains, setComplains] = useState([]);
  const [selectedComplain, setSelectedComplain] = useState(null);
useEffect(() => {
  axios.get("http://localhost:5000/complainlist")
    .then((response) => {
      console.log(response.data); // 👈 VERY IMPORTANT
      setComplains(response.data);
    })
    .catch((error) => console.error("Error fetching complains:", error));
}, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/complainlist")
      .then((response) => setComplains(response.data)) // Updated from setCustomers to setComplains
      .catch((error) => console.error("Error fetching complains:", error));
  }, []);
const handleEdit = (id) => {
  setSelectedComplain(id);
};

const handleDelete = async (id) => {
  console.log("Delete clicked:", id);

  try {
    await axios.delete(`http://localhost:5000/complain/${id}`);
    alert("Deleted successfully");

    // Refresh data after delete
    setComplains(Complains.filter((c) => c.complain_id !== id));
  } catch (error) {
    console.error("Delete error:", error);
  }
};

  return (<>
  <Header/>
    <div className="main-content">
        <div className="table-wrapper">
          <h1 style={{ fontWeight: "bolder", fontFamily: "serif" }}>Complain List :</h1>
          <table>
            <thead>
              <tr>
                <th> ID</th>
                <th> DESCRIPTION</th>
                <th> ServicProvider_Id</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Complains.map((Complain) => (
                <tr key={Complain.complain_id}>
                  <td>{Complain.complain_id}</td>
                  <td>{Complain.complain_text}</td>
                  
                  <td>{Complain.customer_id}</td>
                  
                  <td>
  <span
    style={{ cursor: "pointer", marginRight: "10px" }}
    onClick={() => handleEdit(Complain.complain_id)}
  >
    📝
  </span>

  <span
    style={{ cursor: "pointer", color: "red" }}
    onClick={() => handleDelete(Complain.complain_id)}
  >
    🗑️
  </span>
</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
          {selectedComplain && (
  <div style={{ marginTop: "20px", padding: "20px", background: "#eee" }}>
    <h3>Edit Complain</h3>

    {Complains
      .filter((c) => c.complain_id === selectedComplain)
      .map((c) => (
        <div key={c.complain_id}>
          <p><b>ID:</b> {c.complain_id}</p>
          <p><b>Description:</b> {c.complain_text}</p>
          <p><b>Service Provider:</b> {c.customer_id}</p>
        </div>
      ))}
  </div>
)}
        </div>
      </div>
      </>    
  );
  
  
};

export default ComplainList;
