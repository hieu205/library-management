import React from "react"
import "./Explore.scss"
import axios from "axios"
import no_image from "../../../../assets/no-image.jpg"
import { useState, useEffect } from "react"
import "./Explore.scss"

import NavbarGuestView from "../../../pages/NavbarGuestView/NavbarGuestView"
const Explore = () => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    loadBookListGuestView()
  }, [])
  const [books, setBooks] = useState([])
  const loadBookListGuestView = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_APP_URL}/books`)

      if (response.data.success) {
        console.log(response.data.data)
        setBooks(response.data.data)
      }
    } catch (error) {
      console.error(error.message)
    } finally {
      setLoading(false) // 👈 kết thúc loading
    }
  }
  return (
    <div className="container explore">
      <NavbarGuestView></NavbarGuestView>
      <div className="inner-wrap-explore">
        <div className="inner-topic">
          <h1 className="inner-title">Library Explore</h1>
          <span className="inner-description">
            Dive into a vast ocean of knowledge, from timeless literary classics
            to the latest scientific breakthroughs. Our digital shelves are
            meticulously organized to help you find exactly what you need, when
            you need it.
          </span>
        </div>
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}
        <div className="inner-list">
          {books.slice(0, 20).map((book, index) => (
            <div
              key={index}
              className="book-details-1"
            >
              <div className="image-wrapper">
                <img
                  src={no_image}
                  alt="no-image"
                />
                <span className="inner-title">{book?.title}</span>
              </div>

              <span className="inner-description">{book?.description}</span>
            </div>
          ))}
        </div>

        <div className="inner-button">
          <button>Sign in to Continue</button>
        </div>
      </div>
    </div>
  )
}

export default Explore
