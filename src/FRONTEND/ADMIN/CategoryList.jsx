import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SubcategoryList from "./SubcategoryList";
import Header from "./Header";
import "./Style/CategoryList.css";

function CategoryList() {

  const [categories, setCategories] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] =
    useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {

      const response = await axios.get(
        "http://54.84.125.102:5000/categories"
      );

      setCategories(response.data);

    } catch (error) {

      console.error(
        "Error fetching categories:",
        error
      );

    }
  };

  const handleDelete = async (categoryId) => {

    if (
      window.confirm(
        "Are you sure you want to delete this category?"
      )
    ) {
      try {

        await axios.delete(
          `http://54.84.125.102:5000/categories/${categoryId}`
        );

        fetchCategories();

        setSelectedCategoryId(null);

      } catch (error) {

        console.error(
          "Error deleting category:",
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
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.12)",
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
              Categories
            </h1>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: "15px",
              overflow: "hidden",
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
                <th
                  style={{
                    ...thStyle,
                    width: "10%",
                  }}
                >
                  ID
                </th>

                <th
                  style={{
                    ...thStyle,
                    width: "40%",
                  }}
                >
                  NAME
                </th>

                <th
                  style={{
                    ...thStyle,
                    width: "50%",
                  }}
                >
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.p_cata_id}
                  style={{
                    borderBottom:
                      "1px solid #e5e5e5",
                  }}
                >
                  <td style={tdStyle}>
                    {category.p_cata_id}
                  </td>

                  <td style={tdStyle}>
                    {category.p_cata_name}
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <button
                      onClick={() =>
                        navigate(
                          `/subcategorylist?categoryId=${category.p_cata_id}`
                        )
                      }
                      style={{
                        background:
                          "linear-gradient(135deg,#007bff,#0056d2)",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow:
                          "0 4px 12px rgba(0,123,255,0.3)",
                        transition: "0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform =
                          "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 18px rgba(0,123,255,0.5)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform =
                          "translateY(0px)";
                        e.target.style.boxShadow =
                          "0 4px 12px rgba(0,123,255,0.3)";
                      }}
                    >
                      View Subcategories
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          category.p_cata_id
                        )
                      }
                      style={{
                        background:
                          "linear-gradient(135deg,#dc3545,#b02a37)",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow:
                          "0 4px 12px rgba(220,53,69,0.3)",
                        transition: "0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform =
                          "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 18px rgba(220,53,69,0.5)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform =
                          "translateY(0px)";
                        e.target.style.boxShadow =
                          "0 4px 12px rgba(220,53,69,0.3)";
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedCategoryId && (
            <SubcategoryList
              categoryId={selectedCategoryId}
            />
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

export default CategoryList;