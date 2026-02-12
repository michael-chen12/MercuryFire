<script setup lang="ts">
// ========================================
// 登入頁面
// 符合設計稿：藍紫色背景、白色卡片、表單驗證
// ========================================

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { LoginForm } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

// 表單資料
const form = ref<LoginForm>({
  email: '',
  password: '',
  rememberMe: false,
})

// 是否顯示密碼
const showPassword = ref(false)

// 表單驗證錯誤
const validationErrors = ref({
  email: '',
  password: '',
})

// 頁面載入時，若有記住的 email 則自動填入
onMounted(() => {
  const savedEmail = localStorage.getItem('remembered_email')
  if (savedEmail) {
    form.value.email = savedEmail
    form.value.rememberMe = true
  }
})

// Email 格式驗證
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 提交前驗證表單
function validateForm(): boolean {
  validationErrors.value.email = ''
  validationErrors.value.password = ''

  if (!form.value.email) {
    validationErrors.value.email = '請輸入電子郵件'
    return false
  }
  if (!validateEmail(form.value.email)) {
    validationErrors.value.email = '請輸入有效的電子郵件格式'
    return false
  }
  if (!form.value.password) {
    validationErrors.value.password = '請輸入密碼'
    return false
  }

  return true
}

// 登入處理
async function handleLogin() {
  if (!validateForm()) return

  try {
    await authStore.login(form.value)
    // 登入成功後跳轉至主頁
    router.push('/')
  } catch {
    // 錯誤已由 authStore 統一處理
  }
}
</script>

<template>
  <!-- 頁面背景：淺藍紫色漸層，與設計稿一致 -->
  <div class="min-h-screen bg-primary-50 flex flex-col items-center justify-center px-4">

    <!-- 登入卡片 -->
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

      <!-- 頂部 Logo 區域 -->
      <div class="flex flex-col items-center mb-8">
        <!-- 圓形 Logo 圖示 -->
        <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4 shadow-md">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
        <h1 class="text-2xl font-semibold text-gray-800">歡迎回來</h1>
        <p class="text-sm text-gray-500 mt-1">請登入您的帳號以繼續</p>
      </div>

      <!-- 登入表單 -->
      <form @submit.prevent="handleLogin" class="space-y-5">

        <!-- 電子郵件欄位 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
          <div class="relative">
            <!-- Mail 圖示 -->
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              v-model="form.email"
              type="email"
              placeholder="your@email.com"
              autocomplete="email"
              class="w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none transition-colors"
              :class="validationErrors.email
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-200 focus:border-primary-500'"
              @input="authStore.clearError()"
            />
          </div>
          <!-- 驗證錯誤提示 -->
          <p v-if="validationErrors.email" class="mt-1 text-xs text-red-500">
            {{ validationErrors.email }}
          </p>
        </div>

        <!-- 密碼欄位 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
          <div class="relative">
            <!-- Lock 圖示 -->
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full pl-10 pr-12 py-3 border rounded-xl text-sm outline-none transition-colors"
              :class="validationErrors.password
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-200 focus:border-primary-500'"
              @input="authStore.clearError()"
            />
            <!-- 顯示/隱藏密碼按鈕 -->
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="validationErrors.password" class="mt-1 text-xs text-red-500">
            {{ validationErrors.password }}
          </p>
        </div>

        <!-- 記住我 & 忘記密碼 -->
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input
              v-model="form.rememberMe"
              type="checkbox"
              class="w-4 h-4 rounded border-gray-300 text-primary-600 accent-primary-600"
            />
            <span class="text-sm text-gray-600">記住我</span>
          </label>
          <a href="#" class="text-sm text-primary-600 hover:text-primary-700">忘記密碼？</a>
        </div>

        <!-- API 錯誤提示 -->
        <div v-if="authStore.errorMessage"
          class="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {{ authStore.errorMessage }}
        </div>

        <!-- 登入按鈕 -->
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed
                 text-white py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <!-- 載入動畫 -->
          <svg v-if="authStore.isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          {{ authStore.isLoading ? '登入中...' : '登入' }}
        </button>
      </form>
    </div>

    <!-- 底部連結 -->
    <p class="mt-6 text-sm text-gray-500">
      還沒有帳號？
      <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-medium">立即註冊</router-link>
    </p>
  </div>
</template>
