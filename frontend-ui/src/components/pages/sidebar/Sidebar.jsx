import React from "react"
import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { sidebarData } from "./sidebarData"
import "./Sidebar.scss"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../../../utils/axiosInstance"
const Sidebar = ({ role }) => {
  const [modalRoot, setModalRoot] = useState(null)
  useEffect(() => {
    setModalRoot(document.getElementById("modal-root"))
  }, [])
  const navigate = useNavigate()
  const menu = sidebarData[role] || []
  const [openDropdown, setOpenDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const confirmLogout = async () => {
    // ❗ xoá data user

    try {
      const refreshToken = localStorage.getItem("refreshToken")
      //const accessToken = localStorage.getItem("accessToken")
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_APP_URL}/users/logout`,
        { refreshToken },
      )

      console.log("Log out Successfully")
      localStorage.removeItem("user")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")

      setShowModal(false)
      setShowToast(true)

      // delay rồi redirect
      setTimeout(() => {
        setShowToast(false)
        navigate("/login")
      }, 2000)
    } catch (error) {
      console.error("Logout Failed", error.message)
    }
  }
  const handleLogout = () => {
    setShowModal(true)
  }
  return (
    <div className="container-fluid sidebar">
      <h1 className="inner-title">
        <i className="fa-solid fa-book"></i> Library
      </h1>
      <div className="inner-wrap-sidebar">
        <ul>
          {menu.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                end
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className={`user-info ${openDropdown ? "active" : ""}`}>
          <div className="avatar">
            <i class="fa-solid fa-user"></i>
          </div>
          <div className="user-text">
            {/* <p className="name">{user?.username}</p> */}
            <div>
              {" "}
              <span className="role">{role}</span>
              <h5>User</h5>
              <button
                className="logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        {/* ===== MODAL ===== */}

        {showModal && (
          <div className="logout-modal">
            <h4>Confirm Logout</h4>
            <p>Bạn có chắc muốn đăng xuất?</p>
            <div className="actions">
              <button
                className="cancel"
                onClick={() => setShowModal(false)}
              >
                Huỷ
              </button>
              <button
                className="confirm"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
        {/* ===== TOAST ===== */}
        {showToast && (
          <div className="custom-toast">
            <i className="fa-solid fa-circle-check"></i>
            <span>Đăng xuất thành công!</span>
          </div>
        )}
        {/* DROPDOWN */}
      </div>
    </div>
  )
}

// {menu.map((item, index) => (
//           <li key={index}>
//             <NavLink to={item.path}>
//               {item.name}
//             </NavLink>
//           </li>
//         ))}

{
  /* <Route path="main" element={<BookDetails />}>
  <Route index element={<BookPage />} />   // /main
  <Route path="books" element={<BookPage />} /> // /main/books
  <Route path="add" element={<div>Add Book</div>} /> // /main/add
  <Route path="profile" element={<div>Profile</div>} /> // /main/profile
</Route> */
}
export default Sidebar
