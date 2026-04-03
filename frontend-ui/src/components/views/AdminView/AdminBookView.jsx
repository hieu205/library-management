import React, { useState, useEffect } from "react"
import "./AdminBookView.scss"
import no_image from "../../../assets/no-image.jpg"
import axios from "axios"
import axiosInstance from "../../../../utils/axiosInstance"
const AdminBookView = ({ books = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_APP_URL}/categories`,
      )

      console.log("Get Categories Successfully!!!")
      setCategories(response.data.data)
    } catch (error) {
      console.error("categories failed", error.message)
    }
  }

  // 👉 FILTER THEO CATEGORY
  const filteredBooks =
    selectedCategory === "all"
      ? books
      : books.filter((b) => b.category?.id === selectedCategory)

  return (
    <div className="container-fluid admin-book-view">
      <div className="inner-wrap-admin-book-view">
        {/* LEFT FILTER */}
        <div className="inner-filter-checkbox inner-left">
          <h4>Category ({categories.length})</h4>

          <div className="filter-group">
            <label className="filter-item active">
              <input
                type="radio"
                name="category"
                onChange={() => setSelectedCategory("all")}
                defaultChecked
              />
              <span>All</span>
            </label>

            {categories.map((category) => (
              <label
                key={category.id}
                className="filter-item"
              >
                <input
                  type="radio"
                  name="category"
                  onChange={() => setSelectedCategory(category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT BOOK LIST */}
        <div className="inner-list-book inner-right">
          <ul className="list-book">
            {filteredBooks.map((book, index) => (
              <li key={index}>
                <div
                  className="book-component"
                  onClick={() => setSelectedBook(book)}
                >
                  <img
                    src={no_image}
                    alt={index}
                  />
                  <span className="inner-title">{book?.title}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedBook && (
        <div
          className="book-modal"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE X */}
            <div
              className="modal-close"
              onClick={() => setSelectedBook(null)}
            >
              ×
            </div>

            {/* TITLE */}
            <h2 className="modal-title">Chi tiết sách</h2>

            {/* IMAGE */}
            <div className="modal-image">
              <img
                src={no_image}
                alt=""
              />
            </div>

            {/* INFO */}
            <div className="modal-info">
              <h3 className="book-title">{selectedBook.title}</h3>

              <div className="meta">
                <div>
                  <span>ISBN</span>
                  <p>{selectedBook?.isbn}</p>
                </div>

                <div>
                  <span>Year:</span>
                  <p>{selectedBook?.publishYear}</p>
                </div>

                <div>
                  <span>Language:</span>
                  <p>{selectedBook?.language}</p>
                </div>
              </div>

              <div className="author">
                <span>Author:</span>
                <ul>
                  {selectedBook?.authors.map((author, index) => (
                    <li
                      key={index}
                      className="author-name"
                    >
                      {" "}
                      {author.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="description">
                <span>Description:</span>
                <p>{selectedBook?.description}</p>
              </div>

              <div className="type">
                <span>Type:</span>
                <ul>
                  {selectedBook?.categories.map((category, index) => (
                    <li
                      key={index}
                      className="type-book"
                    >
                      {" "}
                      {category.name}
                    </li>
                  ))}
                </ul>
              </div>

              <button type="button">Read </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBookView
