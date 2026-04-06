import React, { useState, useEffect } from "react"
import "./BookDetails.scss"
import { Outlet } from "react-router-dom"
import Sidebar from "../../../pages/sidebar/Sidebar"
import axiosInstance from "../../../../../utils/axiosInstance"

const BookDetails = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem("user"))
  const role = user ? user.role : "guest"
  useEffect(() => {
    loadBooks()
  }, [])
  const loadBooks = async () => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_APP_URL}/books`,
      )
      setBooks(response.data.data)
    } catch (error) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid book-details p-0">
      <div className="inner-sidebar">
        <Sidebar role={role} />
      </div>

      <div className="inner-book-details">
        <Outlet context={{ books, loading }} />
      </div>
    </div>
  )
}

export default BookDetails
