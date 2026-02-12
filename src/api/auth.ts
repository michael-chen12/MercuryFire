// 認證相關 API

import type { LoginForm } from '@/types'

// 模擬登入：接受 email、password 與 rememberMe，回傳一個 mock token
export async function login(form: LoginForm): Promise<string> {
  // 模擬網路延遲，讓 loading 狀態有時間顯示
  await new Promise<void>((resolve) => setTimeout(resolve, 800))

  // 產生一個簡易的 mock token（包含 email 與時間戳）
  const mockToken = btoa(`${form.email}:${Date.now()}`)

  // 根據「記住我」決定儲存方式
  if (form.rememberMe) {
    localStorage.setItem('remembered_email', form.email)
  } else {
    localStorage.removeItem('remembered_email')
  }

  return mockToken
}

/**
 * 登出：清除所有本地認證資訊
 */
export function logout(): void {
  localStorage.removeItem('access_token')
}
