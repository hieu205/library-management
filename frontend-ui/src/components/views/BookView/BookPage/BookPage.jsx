import React from "react"
import "./BookPage.scss"
import AdminView from "../../AdminView/AdminView"
import UserView from "../../UserView/UserView"
import { useOutletContext } from "react-router-dom"

const BookPage = () => {
  // 👇 nhận data từ cha
  const { books, loading } = useOutletContext()

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

  return <div>No permission</div>
}

export default BookPage
