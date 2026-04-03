import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "./assets/vite.svg"
import heroImg from "./assets/hero.png"
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import {
  Route,
  Router,
  RouterProvider,
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"

import "./index.css"
import Profile from "./components/profile/Profile"
import Layout from "./components/Layout"
import Source from "./components/views/GuestView/source/Source"
import GuestView from "./components/views/GuestView/GuestView"
import Explore from "./components/views/GuestView/explore/Explore"
import Contact from "./components/views/GuestView/contact/Contact"
import Register from "./components/register/Register"
import Login from "./components/login/Login"
import BookPage from "./components/views/BookView/BookPage/BookPage"
import BookDetails from "./components/views/BookView/BookDetails/BookDetails"
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Layout />}
    >
      <Route
        index
        element={<GuestView />}
      ></Route>
      <Route
        path="explore"
        element={<Explore />}
      ></Route>
      <Route
        path="contact"
        element={<Contact />}
      ></Route>

      <Route
        path="source"
        element={<Source />}
      ></Route>
      <Route
        path="login"
        element={<Login />}
      ></Route>
      <Route
        path="register"
        element={<Register />}
      ></Route>
      <Route
        path="main"
        element={<BookDetails />}
      >
        <Route
          index
          element={<BookPage />}
        ></Route>
        <Route
          path="profile"
          element={<Profile />}
        ></Route>
      </Route>
    </Route>,
  ),
)
function App() {
  return <RouterProvider router={router} />
}

export default App
