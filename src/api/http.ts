// ========================================
// Axios 實例封裝與攔截器設定
// 所有 API 請求都透過此模組發送
// ========================================

import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// 建立 axios 實例，統一設定 baseURL 與 timeout
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ----------------------------------------
// 請求攔截器
// 每次請求自動附加必要的 Headers
// ----------------------------------------
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 面試識別 Header（必填，否則伺服器無法辨識身份）
    config.headers['interviewerName'] = import.meta.env.VITE_INTERVIEWER_NAME

    // 如果 localStorage 中有 token，則附加 Authorization Header
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ----------------------------------------
// 回應攔截器
// 統一處理錯誤回應，避免重複 try/catch
// ----------------------------------------
http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status

    // 401 未授權：清除 token，使用 location 跳轉避免循環依賴
    if (status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }

    // 將錯誤訊息格式化後拋出，方便上層組件處理
    return Promise.reject(error)
  }
)

export default http
