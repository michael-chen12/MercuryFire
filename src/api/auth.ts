// 認證相關 API

import type { LoginForm, RegisterForm } from '@/types'

// 模擬登入：接受email，password與ememberMe，回傳一個token
export async function login(form: LoginForm): Promise<string> {
  // 模擬網路延遲，讓 loading 狀態有時間顯示
  await new Promise<void>((resolve) => setTimeout(resolve, 800))

  // 產生一個token（包含 email與timestamp）
  const mockToken = btoa(`${form.email}:${Date.now()}`)

  // 根據「記住我」決定儲存方式
  if (form.rememberMe) {
    localStorage.setItem('remembered_email', form.email)
  } else {
    localStorage.removeItem('remembered_email')
  }

  return mockToken
}

// 模擬註冊：接受 name、email、password，回傳一個 token
export async function register(form: RegisterForm): Promise<string> {
  // 模擬網路延遲
  await new Promise<void>((resolve) => setTimeout(resolve, 800))

  // 產生 token（與 login 相同格式）
  const mockToken = btoa(`${form.email}:${Date.now()}`)
  return mockToken
}

// 登出＋清除token
export function logout(): void {
  localStorage.removeItem('access_token')
}
