import React from "react"
import "./Login.scss"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import NavbarGuestView from "../pages/NavbarGuestView/NavbarGuestView"
const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  })
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/users/login`,
        user,
      )

      console.log("Login Successfully", response.data)
      localStorage.setItem("user", JSON.stringify({ role: "admin" }))
      alert("Login Successfully !!!")
      navigate("/main")
    } catch (error) {
      console.error(error.message)
    }
  }
  return (
    <div className="container">
      <NavbarGuestView></NavbarGuestView>
      <div className="login">
        <div className="inner-wrap-login">
          <h1>LOG IN</h1>
          <form
            action=""
            onSubmit={handleSubmit}
          >
            <div className="input-group">
              <i class="fa-solid fa-at"></i>
              <input
                type="username"
                required
                placeholder="Username ..."
                autoComplete="off"
                name="username"
                value={user.username}
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
              Log in
            </button>

            <span>
              Don't have an account yet? <a href="/register">Register</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
