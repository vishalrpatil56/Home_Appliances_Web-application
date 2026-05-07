import React, { useState, useEffect } from "react";
import axios from "axios";
import SubcategoryForm from "./SubcategoryForm";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import "./Style/CategoryList.css";

function SubcategoryList() {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const categoryId = queryParams.get("categoryId");

  useEffect(() => {
    if (categoryId) {
      fetchSubcategories();
    }
  }, [categoryId]);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(
        `http://54.84.125.102:5000/categories/${categoryId}/subcategories`
      );

      setSubcategories(response.data);

    } catch (error) {

      console.error("Error fetching subcategories:", error);

    }
  };

  const handleDelete = async (subcategoryId) => {

    if (
      window.confirm(
        "Are you sure you want to delete this subcategory?"
      )
    ) {
      try {

        await axios.delete(
          `http://54.84.125.102:5000/subcategories/${subcategoryId}`
        );

        fetchSubcategories();

      } catch (error) {

        console.error(
          "Error deleting subcategory:",
          error
        );

      }
    }
  };

  return (
    <>
      <Header />

      <div
        style={{
  minHeight: "100vh",
  background: "#f4f7fc",
  paddingTop: "120px",
  paddingRight: "40px",
  paddingBottom: "40px",
  paddingLeft: "340px",
}}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <h1
              style={{
                fontSize: "42px",
                fontWeight: "700",
                color: "#1a1a1a",
                margin: 0,
              }}
            >
              Subcategories
            </h1>

            <button
              onClick={() =>
                setSelectedSubcategory({
                  p_sub_cata_name: "",
                  p_sub_cata_description: "",
                })
              }
              style={{
                background:
                  "linear-gradient(135deg,#007bff,#0056d2)",
                color: "white",
                border: "none",
                padding: "12px 22px",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow:
                  "0 4px 15px rgba(0,123,255,0.3)",
              }}
            >
              + Add Subcategory
            </button>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              overflow: "hidden",
              borderRadius: "15px",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(135deg,#007bff,#0056d2)",
                  color: "white",
                }}
              >
                <th style={thStyle}>ID</th>
                <th style={thStyle}>NAME</th>
                <th style={thStyle}>DESCRIPTION</th>
                <th style={thStyle}>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {subcategories.map((subcategory) => (
                <tr
                  key={subcategory.p_sub_cata_id}
                  style={{
                    borderBottom: "1px solid #e5e5e5",
                  }}
                >
                  <td style={tdStyle}>
                    {subcategory.p_sub_cata_id}
                  </td>

                  <td style={tdStyle}>
                    {subcategory.p_sub_cata_name}
                  </td>

                  <td style={tdStyle}>
                    {subcategory.p_sub_cata_description}
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() =>
                        setSelectedSubcategory(subcategory)
                      }
                      style={{
                        background:
                          "linear-gradient(135deg,#28a745,#1e7e34)",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        marginRight: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          subcategory.p_sub_cata_id
                        )
                      }
                      style={{
                        background:
                          "linear-gradient(135deg,#dc3545,#b02a37)",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedSubcategory && (
            <div style={{ marginTop: "40px" }}>
              <SubcategoryForm
                categoryId={categoryId}
                subcategory={selectedSubcategory}
                fetchSubcategories={fetchSubcategories}
                setSelectedSubcategory={
                  setSelectedSubcategory
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const thStyle = {
  padding: "18px",
  textAlign: "left",
  fontSize: "17px",
  fontWeight: "700",
};

const tdStyle = {
  padding: "20px",
  fontSize: "16px",
  fontWeight: "500",
};

export default SubcategoryList;