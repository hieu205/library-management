import React from "react"
import "./NavbarGuestView.scss"
import { NavLink, useNavigate } from "react-router-dom"
const NavbarGuestView = () => {
  const navigate = useNavigate()
  return (
    <div className="container-fluid navbar-guest-view p-0 w-100">
      <div className="inner-wrap-navbar-guest-view">
        <div className="inner-logo">
          <h3 onClick={() => navigate("/")}>Library Management</h3>

          <ul className="nav-list">
            <li>
              <NavLink to="/explore">Explore</NavLink>
            </li>
            <li>
              <NavLink to="/source">Source</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>

          <div className="inner-contact">
            <button
              className="btn sign-up"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
            <button
              className="btn log-in"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarGuestView
