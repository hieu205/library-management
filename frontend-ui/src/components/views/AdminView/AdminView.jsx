import React from "react"
import "./AdminView.scss"

import AdminBookView from "./AdminBookView"
const AdminView = ({ books }) => {
  const user = JSON.parse(localStorage.getItem("user"))

  const role = user.role || "guest"
  return (
    <div className="container-fluid admin-view">
      <div className="inner-wrap-admin-view">
        <div className="inner-welcome">Xin Chào {role}</div>
        <div className="inner-introduction">
          <h2>Library Books</h2>
          <span>
            Explore a rich collection of books with diverse genres and authors.
          </span>

          <form action="">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Tìm kiếm sách, thể loại, tác giả ..."
            />
          </form>
        </div>

        <div className="inner-list">
          <div className="list-1 list">
            <div className="logo">
              <i className="fa-solid fa-chart-simple"></i>
            </div>
            <div className="text-1 text">
              <h4>Kho sách phong phú</h4>
              <p>Đa dạng thể loại và tác giả</p>
            </div>
          </div>
          <div className="list-2 list">
            <div className="logo">
              <i className="fa-solid fa-rocket"></i>
            </div>
            <div className="text-2 text">
              <h4>Tìm kiếm nhanh</h4>
              <p>Lọc theo thể loại và tác giả</p>
            </div>
          </div>
          <div className="list-3 list">
            <div className="logo">
              <i className="fa-solid fa-clock"></i>
            </div>
            <div className="text-3 text">
              <h4>Mượn trả dễ dàng</h4>
              <p>Quản lý phiếu mượn online</p>
            </div>
          </div>
          <div className="list-4 list">
            <div className="logo">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="text-4 text">
              <h4>Miễn phí thành viên</h4>
              <p>Đăng kí tài khoản miễn phí</p>
            </div>
          </div>
        </div>

        <AdminBookView books={books}></AdminBookView>
      </div>
    </div>
  )
}

export default AdminView
