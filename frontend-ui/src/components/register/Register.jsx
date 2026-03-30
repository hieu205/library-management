import React, { useState } from "react"
import "./Register.scss"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import NavbarGuestView from "../pages/NavbarGuestView/NavbarGuestView"
const Register = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
  })

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/users/register`,
        user,
      )

      console.log("Register Successfully", response.data)

      alert("Register Successfully !!!")
      navigate("/")
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <div className="container">
      <NavbarGuestView></NavbarGuestView>
      <div className="container login">
        <div className="inner-wrap-login">
          <h1>Sign up</h1>
          <form
            action=""
            onSubmit={handleSubmit}
          >
            <div className="input-group">
              <i class="fa-solid fa-address-card"></i>
              <input
                type="text"
                required
                placeholder="Full Name ..."
                autoComplete="off"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
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
                name="username"
                value={user.username}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <i class="fa-solid fa-at"></i>
              <input
                type="email"
                required
                placeholder="Email ..."
                autoComplete="off"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <i class="fa-solid fa-phone"></i>
              <input
                type="text"
                required
                placeholder="Phone ..."
                autoComplete="off"
                name="phone"
                value={user.phone}
                onChange={handleChange}
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
                value={user.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn-submit"
            >
              Sign up
            </button>

            <span>
              Do you already have an account? <a href="/login">Login</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
