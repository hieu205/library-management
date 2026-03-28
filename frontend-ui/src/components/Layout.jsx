import React from "react"
import NavbarGuestView from "./pages/NavbarGuestView/NavbarGuestView"
import { Outlet, Link } from "react-router-dom"
const Layout = () => {
  return (
    <div className="container-fluid layout p-0">
      <div className="inner-wrap-layout">
        <NavbarGuestView></NavbarGuestView>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default Layout
