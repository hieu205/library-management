import React, { useState, useEffect } from "react"
import "./Profile.scss"
import axiosInstance from "../../../utils/axiosInstance"

const Profile = () => {
  useEffect(() => {
    getProfileMe()
  }, [])
  const [user, setUser] = useState({})
  const [activeTab, setActiveTab] = useState("info")
  const [isEditing, setIsEditing] = useState(false)

  const [editErrors, setEditErrors] = useState({})
  const [editSuccess, setEditSuccess] = useState(false)

  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [pwErrors, setPwErrors] = useState({})
  const [pwSuccess, setPwSuccess] = useState(false)

  const borrowHistory = []
  const borrowing = []

  const tabs = [
    { key: "info", label: "Thông tin" },
    { key: "borrow-history", label: "Lịch sử mượn" },
    { key: "borrowing", label: "Đang mượn" },
    { key: "password", label: "Đổi mật khẩu" },
  ]

  const getProfileMe = async (e) => {
    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_APP_URL}/users/me`,
      )

      console.log("Get Profile me Successfully !!! ")
      setUser(response.data.data)
    } catch (error) {
      console.error("Error get Profile me", error.message)
    }
  }
  /* ── Password change logic ── */
  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value })
    setPwErrors({ ...pwErrors, [e.target.name]: "" })
    setPwSuccess(false)
  }

  const handlePwSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!pwForm.oldPassword) errs.oldPassword = "Vui lòng nhập mật khẩu cũ"
    if (!pwForm.newPassword || pwForm.newPassword.length < 6)
      errs.newPassword = "Mật khẩu mới tối thiểu 6 ký tự"
    if (pwForm.newPassword !== pwForm.confirmPassword)
      errs.confirmPassword =
        "Mật khẩu xác nhận không trùng khớp, vui lòng nhập lại"
    if (Object.keys(errs).length) {
      setPwErrors(errs)
      return
    }
    const response = await axiosInstance.patch(
      `${import.meta.env.VITE_APP_URL}/users/me/password`,
      {
        currentPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      },
    )
    console.log("Password Change", response.data)
    alert("Chang Password Successfully !!!")
    setPwSuccess(true)
    setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
  }

  /* ── Edit profile logic ── */
  const handleEditChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
    setEditErrors({ ...editErrors, [e.target.name]: "" })
    setEditSuccess(false)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_APP_URL}/users/me`,
        {
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          username: user.username,
        },
      )

      console.log("Edit profile Successfully !!!", response.data)

      setEditSuccess(true)
      setIsEditing(false)
    } catch (error) {
      console.error("Edit Profile Failed")
    }
  }

  return (
    <div className="profile-page">
      {/* ── Decorative background blobs ── */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="profile-card">
        {/* ── Avatar + basic info ── */}
        <div className="profile-hero">
          <div className="avatar-ring">
            <div className="avatar-letter">
              {user?.username?.[0]?.toUpperCase()}
            </div>
          </div>
          <div className="hero-text">
            <h2 className="hero-name">{user?.fullName || user?.username}</h2>
            <span className="hero-email">{user?.email}</span>
            <span className="hero-badge">{user?.role}</span>
          </div>
        </div>

        {/* ── Tab nav ── */}
        <div className="tab-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.key)
                setIsEditing(false)
              }}
            >
              {tab.label}
              {activeTab === tab.key && <span className="tab-underline" />}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="tab-content">
          {/* INFO */}
          {activeTab === "info" && (
            <div className="panel fade-in">
              {!isEditing ? (
                <>
                  <div className="info-grid">
                    {[
                      ["Họ và tên", user?.fullName],
                      ["Username", user?.username],
                      ["Email", user?.email],
                      ["Số điện thoại", user?.phone],
                      ["Vai trò", user?.role],
                      ["Trạng thái", "Hoạt động"],
                    ].map(([label, value]) => (
                      <div
                        className="info-item"
                        key={label}
                      >
                        <span className="info-label">{label}</span>
                        <span className="info-value">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa thông tin
                  </button>
                </>
              ) : (
                <form
                  className="edit-form fade-in"
                  noValidate
                >
                  <h4 className="form-title">Chỉnh sửa thông tin</h4>

                  <div
                    className={`field ${editErrors.username ? "has-error" : ""}`}
                  >
                    <label>Username</label>
                    <input
                      name="username"
                      value={user?.username}
                      disabled
                      placeholder="Nhập username"
                    />
                    {editErrors.username && (
                      <span className="err-msg">{editErrors.username}</span>
                    )}
                  </div>

                  <div
                    className={`field ${editErrors.email ? "has-error" : ""}`}
                  >
                    <label>Email</label>
                    <input
                      name="email"
                      type="email"
                      value={user?.email}
                      onChange={handleEditChange}
                      placeholder="Nhập email"
                    />
                    {editErrors.email && (
                      <span className="err-msg">{editErrors.email}</span>
                    )}
                  </div>

                  <div
                    className={`field ${editErrors.password ? "has-error" : ""}`}
                  >
                    <label>Fullname</label>
                    <input
                      name="fullName"
                      type="text"
                      value={user?.fullName}
                      onChange={handleEditChange}
                      placeholder="Nhập fullName"
                    />
                  </div>
                  <div
                    className={`field ${editErrors.email ? "has-error" : ""}`}
                  >
                    <label>Email</label>
                    <input
                      name="phone"
                      type="phone"
                      value={user?.phone}
                      onChange={handleEditChange}
                      placeholder="Phone"
                    />
                  </div>

                  {editSuccess && (
                    <div className="success-msg">
                      Cập nhật thông tin thành công!
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      onClick={handleEditSubmit}
                    >
                      Lưu thay đổi
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Huỷ
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* BORROW HISTORY */}
          {activeTab === "borrow-history" && (
            <div className="panel fade-in">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Ngày mượn</th>
                      <th>Hạn trả</th>
                      <th>Trạng thái</th>
                      <th>Sách</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowHistory.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="empty-cell"
                        >
                          <div className="empty-state">
                            <span>Chưa có lịch sử mượn</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      borrowHistory.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.borrowDate}</td>
                          <td>{item.dueDate}</td>
                          <td>
                            <span className="status-badge">{item.status}</span>
                          </td>
                          <td>{item.book}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BORROWING */}
          {activeTab === "borrowing" && (
            <div className="panel fade-in">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tên sách</th>
                      <th>Ngày mượn</th>
                      <th>Hạn trả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowing.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="empty-cell"
                        >
                          <div className="empty-state">
                            <span>Không có sách đang mượn</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      borrowing.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.book}</td>
                          <td>{item.borrowDate}</td>
                          <td>{item.dueDate}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CHANGE PASSWORD */}
          {activeTab === "password" && (
            <div className="panel fade-in">
              <form
                className="pw-form"
                onSubmit={handlePwSubmit}
                noValidate
              >
                <h4 className="form-title">Đổi mật khẩu</h4>

                <div
                  className={`field ${pwErrors.oldPassword ? "has-error" : ""}`}
                >
                  <label>Mật khẩu cũ</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={pwForm.oldPassword}
                    onChange={handlePwChange}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  {pwErrors.oldPassword && (
                    <span className="err-msg">{pwErrors.oldPassword}</span>
                  )}
                </div>

                <div
                  className={`field ${pwErrors.newPassword ? "has-error" : ""}`}
                >
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={pwForm.newPassword}
                    onChange={handlePwChange}
                    placeholder="Tối thiểu 6 ký tự"
                  />
                  {pwErrors.newPassword && (
                    <span className="err-msg">{pwErrors.newPassword}</span>
                  )}
                </div>

                <div
                  className={`field ${pwErrors.confirmPassword ? "has-error" : ""}`}
                >
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={pwForm.confirmPassword}
                    onChange={handlePwChange}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  {pwErrors.confirmPassword && (
                    <span className="err-msg shake">
                      {pwErrors.confirmPassword}
                    </span>
                  )}
                </div>

                {pwSuccess && (
                  <div className="success-msg"> Đổi mật khẩu thành công!</div>
                )}

                <button
                  type="submit"
                  className="btn-primary full-width"
                >
                  Xác nhận đổi mật khẩu
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
