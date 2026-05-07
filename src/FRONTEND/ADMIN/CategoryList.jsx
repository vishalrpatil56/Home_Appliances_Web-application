import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SubcategoryList from "./SubcategoryList";
import Header from "./Header";
import "./Style/CategoryList.css"
function CategoryList() {
  
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://54.84.125.102:5000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://54.84.125.102:5000/categories/${categoryId}`);
        fetchCategories();
        setSelectedCategoryId(null); // Reset subcategory view
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="category-list-container">
        <div className="main-content">
          <div className="table-wrapper2">
            <h1>Categories</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
    <tr key={category.p_cata_id}>
      <td>{category.p_cata_id}</td>
      <td>{category.p_cata_name}</td>
      <td>{category.p_cata_description}</td>
                    <td>
                      <button
  className="btn btn-primary"
  onClick={() =>
    navigate(`/subcategorylist?categoryId=${category.p_cata_id}`)
  }
>
  View Subcategories
</button>
                      <button
  className="btn btn-danger"
  onClick={() => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (confirmDelete) {
      handleDelete(category.p_cata_id);
    }
  }}
>
  Delete
</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Show subcategories if a category is selected */}
            {selectedCategoryId && (
              <SubcategoryList categoryId={selectedCategoryId} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryList;
