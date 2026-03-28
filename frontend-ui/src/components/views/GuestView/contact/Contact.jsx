import React from "react"
import "./Contact.scss"
const Contact = () => {
  return (
    <div className="container">
      <div className="contact">
        <div className="inner-contact">
          {/* LEFT */}
          <div className="contact-info">
            <h2>Contact Us</h2>
            <p>Feel free to reach out anytime</p>

            <div className="info-item">📍 PTIT, Hanoi, Vietnam</div>
            <div className="info-item">📧 tanden1357@gmail.com</div>
            <div className="info-item">📞 0123 456 789</div>
          </div>

          {/* RIGHT */}
          <div className="contact-form">
            <input
              type="text"
              placeholder="Your Name"
            />
            <input
              type="email"
              placeholder="Your Email"
            />
            <textarea placeholder="Your Message"></textarea>
            <button>Send Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
