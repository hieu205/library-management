import axios from "axios"

// nởi để xử lí requrest có bearer và gửi request trước khi
// hết accessToken
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
})
// gửi request thay vì dùng Bearer
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
// interceptors chạy trước khi request gửi đi
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      !originalRequest._retry &&
      (error.response.status === 500 ||
        error.response.status === 401 ||
        error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) {
        localStorage.clear()
        window.location.href = "/login"
        return Promise.reject(error)
      }
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_URL}/users/refresh`,
          { refreshToken },
        )

        const newAccessToken = response.data.data.accessToken
        const newRefreshToken = response.data.data.refreshToken

        localStorage.setItem("accessToken", newAccessToken)
        localStorage.setItem("refreshToken", newRefreshToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return axiosInstance(originalRequest)
      } catch (err) {
        localStorage.clear()
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
