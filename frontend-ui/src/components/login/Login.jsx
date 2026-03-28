import React from "react"
import "./Login.scss"
const Login = () => {
  return (
    <div className="container login">
      <div className="inner-wrap-login">
        <h1>LOG IN</h1>
        <form action="">
          <div className="input-group">
            <i class="fa-solid fa-address-card"></i>
            <input
              type="text"
              required
              placeholder="Full Name ..."
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            {" "}
            <i class="fa-regular fa-user"></i>
            <input
              type="text"
              required
              placeholder="Username..."
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <i class="fa-solid fa-at"></i>
            <input
              type="email"
              required
              placeholder="Email ..."
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <i class="fa-solid fa-phone"></i>
            <input
              type="text"
              required
              placeholder="Phone ..."
              autoComplete="off"
            />
          </div>
          <div className="input-group">
            <i class="fa-solid fa-lock"></i>
            <input
              type="password"
              required
              placeholder="Password ..."
              name="password"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
