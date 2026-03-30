import React from "react"
import "./BookDetails.scss"

// bookDetail
import axios from "axios"
import BookPage from "../BookPage/BookPage"
import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../../../pages/sidebar/Sidebar"
const BookDetails = () => {
  const [openSidebar, setOpenSidebar] = useState(false)

  const user = JSON.parse(localStorage.getItem("user"))

  const role = user ? user.role : "guest"
  return (
    <div className="container-fluid book-details p-0">
      <div className="inner-sidebar">
        <Sidebar role={role}></Sidebar>
      </div>
      <div className="inner-book-details">
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default BookDetails

// 💡 3. Vì sao nên có BookPage?

// 👉 Sau này bạn sẽ có thêm:

// Loading
// Error
// API call
// Layout riêng
// Permission phức tạp

// 👉 Nếu nhét hết vào BookDetails:

// BookDetails.jsx = 300 dòng 😭
// 🧩 4. So sánh dễ hiểu
// ❌ Không tách
// BookDetails = ALL IN ONE
// ✅ Tách
// BookDetails = fetch data
// BookPage = xử lý role
// View = UI
