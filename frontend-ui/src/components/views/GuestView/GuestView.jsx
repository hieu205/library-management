import React from "react"

import "./GuestView.scss"
import Footer from "../../pages/footer/Footer"
import Introduction from "../../introduction/Introduction"
import NavbarGuestView from "../../pages/NavbarGuestView/NavbarGuestView"
const GuestView = () => {
  return (
    <div className="container guest-view">
      <NavbarGuestView></NavbarGuestView>
      <div className="inner-wrap-guest-view">
        <div className="inner-title">
          <h1 className="main-title">My Library</h1>
          <span className="extra-title">Where Stories Come to Life</span>
          <p className="inner-description">
            Step into a sanctuary where every page is a new beginning. Our
            library fuels your imagination and transforms your perspective,
            offering a gateway to infinite horizons. From quiet escapes to
            complex solutions, join us as we explore the beauty of human
            thought—one story at a time.
          </p>
        </div>
      </div>
      <Introduction></Introduction>
      <Footer></Footer>
    </div>
  )
}

export default GuestView
