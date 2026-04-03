import React from "react"
import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { sidebarData } from "./sidebarData"
import "./Sidebar.scss"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"
const Sidebar = ({ role }) => {
  const navigate = useNavigate()
  const menu = sidebarData[role] || []
  const [openDropdown, setOpenDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const confirmLogout = () => {
    // ❗ xoá data user
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    setShowModal(false)
    setShowToast(true)

    // delay rồi redirect
    setTimeout(() => {
      setShowToast(false)
      navigate("/login")
    }, 2000)
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

        {showModal &&
          createPortal(
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Confirm Logout</h3>
                <p>Bạn có chắc muốn đăng xuất?</p>
                <div className="modal-actions">
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
            </div>,
            document.getElementById("modal-root"),
          )}
        {/* ===== TOAST ===== */}

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
