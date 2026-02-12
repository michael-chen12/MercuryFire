// Pinia Auth Store

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, logout as apiLogout } from '@/api/auth'
import type { LoginForm } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  // 從 localStorage 初始化，支援頁面重整後保持登入
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const isLoading = ref(false)
  const errorMessage = ref('')

  // Getters
  // 只要 token 存在就視為已登入
  const isLoggedIn = computed(() => !!token.value)

  // Actions

  /**
   * 執行登入流程
   * 成功後將 token 存入 localStorage 並更新狀態
   */
  async function login(form: LoginForm): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const newToken = await apiLogin(form)
      token.value = newToken
      localStorage.setItem('access_token', newToken)
    } catch (err: unknown) {
      errorMessage.value = '登入失敗，請確認帳號或密碼是否正確'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 登出：清除所有認證狀態
   */
  function logout(): void {
    apiLogout()
    token.value = null
    errorMessage.value = ''
  }

  /**
   * 清除錯誤訊息（供表單重置時呼叫）
   */
  function clearError(): void {
    errorMessage.value = ''
  }

  return {
    token,
    isLoading,
    errorMessage,
    isLoggedIn,
    login,
    logout,
    clearError,
  }
})
