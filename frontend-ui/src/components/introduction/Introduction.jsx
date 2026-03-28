import React from "react"
import "./Introduction.scss"
import image1 from "../../assets/image1.jpg"
import image2 from "../../assets/image2.jpg"

import data from "./data"
const Introduction = () => {
  return (
    <div className="container introduction">
      <div className="inner-wrap-introduction">
        <div className="introduction-1">
          <div className="inner-left">
            <h1>Read AnyTime, Any Where</h1>
            <p>
              Experience the ultimate freedom of a portable library. Our
              platform is optimized for all devices, ensuring a seamless and
              immersive reading journey whether you're at home, in a café, or on
              the move.
            </p>
          </div>
          <div className="inner-right inner-image">
            <img
              src={image1}
              alt="image1"
            />
          </div>
        </div>
        <div className="introduction2">
          <div className="inner-left inner-image">
            <img
              src={image2}
              alt="image1"
            />
          </div>
          <div className="inner-right">
            <h1>A Sanctuary for Dreamers & Thinkers</h1>
            <p>
              We believe a library is more than just storage; it's a laboratory
              for ideas. Join a global community of lifelong learners and let
              our resources fuel your imagination and transform your
              perspective.
            </p>
          </div>
        </div>
        <div className="inner-belt">
          <ul className="inner-belt-details">
            {data.map((d, index) => (
              <li key={index}>
                <img
                  src={d.image}
                  alt={`img${index}`}
                />
                <span>{d.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Introduction
