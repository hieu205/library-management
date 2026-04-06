import React from "react"
import "./Login.scss"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import NavbarGuestView from "../pages/NavbarGuestView/NavbarGuestView"
const Login = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  })
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

      localStorage.setItem(
        "user",
        JSON.stringify({
          role: "admin",
          info: response.data.data,
        }),
      )
      localStorage.setItem("refreshToken", response.data.data.refreshToken)
      localStorage.setItem("accessToken", response.data.data.accessToken)

      //  toast success
      setToast({
        show: true,
        message: "Login thành công!",
        type: "success",
      })

      setTimeout(() => {
        navigate("/main")
      }, 1500)
    } catch (error) {
      console.error(error.message)

      //  toast error
      setToast({
        show: true,
        message: "Sai tài khoản hoặc mật khẩu!",
        type: "error",
      })

      setTimeout(() => {
        setToast({ ...toast, show: false })
      }, 2000)
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
              <i className="fa-solid fa-at"></i>
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
              <i className="fa-solid fa-lock"></i>
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
      {toast.show && (
        <div className={`custom-toast1 ${toast.type}`}>
          <i
            className={`fa-solid ${
              toast.type === "success"
                ? "fa-circle-check"
                : "fa-circle-exclamation"
            }`}
          ></i>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default Login
