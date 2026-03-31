import React from "react"
import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { sidebarData } from "./sidebarData"
import "./Sidebar.scss"
const Sidebar = ({ role }) => {
  const menu = sidebarData[role] || []

  return (
    <div className="container-fluid sidebar">
      <h1 className="inner-title">
        <i className="fa-solid fa-book"></i> Library
      </h1>
      <div className="inner-wrap-sidebar">
        <ul>
          {menu.map((item, index) => (
            <li key={index}>
              <NavLink to={item.path}>{item.name}</NavLink>
            </li>
          ))}
        </ul>
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
