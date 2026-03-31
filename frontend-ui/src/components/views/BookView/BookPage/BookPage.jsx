import React from "react"

import "./BookPage.scss"
import AdminView from "../../AdminView/AdminView"
import { useState, useEffect } from "react"

import axios from "axios"

import UserView from "../../UserView/UserView"
const BookPage = () => {
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState([])
  useEffect(() => {
    loadBooks()
  }, [])
  const loadBooks = async (e) => {
    try {
      // lấy hết book
      const response = await axios.get(`${import.meta.env.VITE_APP_URL}/books`)

      console.log(response.data)

      setBooks(response.data.data)
    } catch (error) {
      console.error("Get Book Failed ", error.message)
    } finally {
      setLoading(false)
    }
  }

  const user = JSON.parse(localStorage.getItem("user"))
  const role = user ? user.role : "guest"
  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading books...</p>
      </div>
    )
  if (role === "admin") return <AdminView books={books} />
  if (role === "user") return <UserView books={books} />
}

export default BookPage
