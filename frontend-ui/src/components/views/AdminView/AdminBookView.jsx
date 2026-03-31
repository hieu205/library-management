import React, { useState } from "react"
import "./AdminBookView.scss"
import no_image from "../../../assets/no-image.jpg"

const AdminBookView = ({ books }) => {
  const [selectedGenre, setSelectedGenre] = useState("all")

  // lấy danh sách genre unique
  const genres = [...new Set(books.map((b) => b.genre))]

  const filteredBooks =
    selectedGenre === "all"
      ? books
      : books.filter((b) => b.genre === selectedGenre)

  return (
    <div className="container-fluid admin-book-view">
      <div className="inner-wrap-admin-book-view">
        {/* LEFT FILTER */}
        <div className="inner-filter-checkbox inner-left">
          <h4>Filter</h4>

          <div className="filter-group">
            <label>
              <input
                type="radio"
                name="genre"
                onChange={() => setSelectedGenre("all")}
                defaultChecked
              />
              All
            </label>

            {genres.map((g, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="genre"
                  onChange={() => setSelectedGenre(g)}
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT BOOK LIST */}
        <div className="inner-list-book inner-right">
          <ul className="list-book">
            {filteredBooks.map((book, index) => (
              <li key={index}>
                <div className="book-component">
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
    </div>
  )
}

export default AdminBookView
