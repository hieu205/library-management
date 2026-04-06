import React, { useEffect, useState } from "react"
import "./Author.scss"
import { FaRegTrashAlt } from "react-icons/fa"
import { CiEdit } from "react-icons/ci"
import axiosInstance from "../../../utils/axiosInstance"
import { FaLock } from "react-icons/fa"
const Author = () => {
  useEffect(() => {
    loadAuthors()
  }, [])
  const [showAddAuthor, setShowAddAuthor] = useState(false)
  const [showDeleteAuthor, setShowDeleteAuthor] = useState(false)
  const [showEditAuthor, setShowEditAuthor] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // formData

  const [selectedAuthor, setSelectedAuthor] = useState({})
  const [addAuthor, setAddAuthor] = useState({ name: "", biography: "" })
  const [editAuthor, setEditAuthor] = useState({ name: "", biography: "" })
  const [authors, setAuthors] = useState([])
  // GET	/authors
  // GET /authors/{id}
  const loadAuthors = async () => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_APP_URL}/authors`,
      )
      console.log("Get All author Successfully !!! ")
      setAuthors(response.data.data)
    } catch (error) {
      console.error("Error get Author", error.message)
    }
  }
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  })
  const handleEditChange = (e) => {
    setEditAuthor({
      ...editAuthor,
      [e.target.name]: e.target.value,
    })
  }
  const handleAddChange = (e) => {
    setAddAuthor({
      ...addAuthor,
      [e.target.name]: e.target.value,
    })
  }
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" })
    }, 3000)
  }
  const handleAddAuthorSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_APP_URL}/authors`,
        addAuthor,
      )

      console.log("Add Author Successfully")

      showToast("Thêm tác giả thành công", "success")
      setShowAddAuthor(false)
      setAddAuthor({ name: "", biography: "" })
      loadAuthors()
    } catch (err) {
      showToast("Thêm thất bại", "error")
    }
  }
  const handleEditAuthorSubmit = async () => {
    try {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_APP_URL}/authors/${selectedAuthor.id}`,
        editAuthor,
      )
      console.log("Edit Author Successfully")
      showToast("Cập nhật thành công", "success")
      setShowEditAuthor(false)
      loadAuthors()
    } catch (err) {
      showToast("Cập nhật thất bại", "error")
    }
  }

  const confirmDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_APP_URL}/authors/${selectedAuthor.id}`,
      )
      showToast("Xóa thành công", "success")
      setShowDeleteAuthor(false)
      loadAuthors()
    } catch (error) {
      console.error("Error Delete Author", error.message)
    }
  }
  return (
    <div className="container-fluid author">
      <div className="inner-wrap-author">
        <div className="inner-title">
          <div className="inner-description">
            <h4>Quản lý tác giả</h4>
            <span>31 tác giả</span>
          </div>
          {/* chia đôi 2 bên cho tôi */}
          <div className="inner-button-add-author">
            <button onClick={() => setShowAddAuthor(true)}>
              + Thêm tác giả
            </button>
          </div>
        </div>
        <div className="inner-filter"></div>
        <div className="list-author">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tên tác giả</th>
                <th scope="col">Tiểu sử</th>
                <th
                  scope="col"
                  colSpan="2"
                  style={{ textAlign: "center", fontSize: "20px" }}
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author, index) => (
                <tr key={index}>
                  <th scope="row">{index}</th>
                  <td>
                    <b>{author?.name}</b>
                  </td>
                  <td>{author?.biography}</td>
                  <td style={{ textAlign: "center", color: "blue" }}>
                    <CiEdit
                      style={{ textAlign: "center", fontSize: "25px" }}
                      onClick={() => {
                        setSelectedAuthor(author)
                        setEditAuthor({
                          name: author.name,
                          biography: author.biography,
                        })
                        setShowEditAuthor(true)
                      }}
                    />
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <FaRegTrashAlt
                      style={{ color: "red", fontSize: "25px" }}
                      onClick={() => {
                        setShowDeleteAuthor(true)
                        setSelectedAuthor(author)
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteAuthor && (
        <div className="delete-modal">
          <div className="modal-box">
            <h4>Delete Author</h4>
            <p>Bạn có chắc muốn xóa tác giả này?</p>

            <div className="actions">
              <button
                className="cancel"
                onClick={() => setShowDeleteAuthor(false)}
              >
                Huỷ
              </button>

              <button
                className="confirm"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditAuthor && (
        <div className="edit-author-form">
          <div className="form-content">
            <h3>Chỉnh sửa thông tin tác giả</h3>
            <label htmlFor="">Tên tác giả:</label>
            <br />
            <input
              type="text"
              name="name"
              placeholder="Tên tác giả"
              value={editAuthor?.name}
              onChange={handleEditChange}
            />
            <label htmlFor="">Tiểu sử:</label>
            <br />
            <textarea
              name="biography"
              placeholder="Tiểu sử"
              value={editAuthor?.biography}
              onChange={handleEditChange}
            />

            <div className="form-actions">
              <button
                style={{ color: "white", backgroundColor: "#353437" }}
                onClick={() => setShowEditAuthor(false)}
              >
                Huỷ
              </button>

              <button onClick={handleEditAuthorSubmit}>Cập nhật</button>
            </div>
          </div>
        </div>
      )}

      {showAddAuthor && (
        <div className="add-author-form">
          <div className="form-content">
            <h3>Thêm tác giả</h3>
            <label htmlFor="">Tên tác giả:</label>
            <br />
            <input
              type="text"
              name="name"
              placeholder="Tên tác giả"
              value={addAuthor?.name}
              onChange={handleAddChange}
            />
            <label htmlFor="">Tiểu sử:</label>
            <br />
            <textarea
              name="biography"
              placeholder="Tiểu sử"
              value={addAuthor?.biography}
              onChange={handleAddChange}
            />

            <div className="form-actions">
              <button onClick={() => setShowAddAuthor(false)}>Huỷ</button>

              <button onClick={handleAddAuthorSubmit}>Thêm</button>
            </div>
          </div>
        </div>
      )}
      {toast.show && (
        <div className={`custom-toast2 ${toast.type}`}>
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

export default Author
