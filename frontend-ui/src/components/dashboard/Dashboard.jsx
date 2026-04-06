import { useState, useEffect } from "react"
import React from "react"
import "./Dashboard.scss"
import { useOutletContext } from "react-router-dom"
import axiosInstance from "../../../utils/axiosInstance"
const Dashboard = () => {
  //   const { books, loading } = useOutletContext()
  const [users, setUsers] = useState({})
  const [books, setBooks] = useState([])
  useEffect(() => {
    ;(loadUsers(), loadBooks())
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

  const loadUsers = async () => {
    try {
      // layaasy tổng user

      const user = JSON.parse(localStorage.getItem("user"))

      const response = await axiosInstance.get(
        `${import.meta.env.VITE_APP_URL}/users`,
      )

      setUsers(response.data.data)
      console.log("Get User from ADmin Successfully")
    } catch (error) {
      console.error("Load User Failed", error.message)
    }
  }
  return (
    <div className="container-fluid dashboard">
      <div className="inner-wrap-dashboard">
        <div className="inner-title">
          <h2>Dashboard</h2>
          <span>Tổng quan hệ thống quản lý thư viện</span>
        </div>
        <div className="inner-statistic">
          <div className="inner-group group-1">
            <i class="fa-solid fa-book-open"></i>
            <h3>{books?.length}</h3>
            <span>Tổng số sách</span>
          </div>
          <div className="inner-group group-2">
            <i class="fa-solid fa-users"></i>
            <h3>{users?.length}</h3>
            <span>Người dùng</span>
          </div>
          <div className="inner-group group-3">
            <i class="fa-solid fa-arrow-right-arrow-left"></i>
            <h3>15</h3>
            <span>Sách đang mượn</span>
          </div>
          <div className="inner-group group-4">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h3>4</h3>
            <span>Phiếu quá hạn</span>
          </div>
        </div>
        <div className="inner-chart"></div>
      </div>{" "}
    </div>
  )
}

export default Dashboard
