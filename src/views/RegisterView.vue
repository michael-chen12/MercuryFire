<script setup lang="ts">
// ========================================
// 註冊頁面
// 風格與登入頁一致：藍紫色背景、白色卡片
// ========================================

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register as apiRegister } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import type { RegisterForm } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

// 表單資料
const form = ref<RegisterForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 是否顯示密碼
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 載入 / 錯誤狀態（本地，不污染 authStore）
const isLoading = ref(false)
const errorMessage = ref('')

// 欄位驗證錯誤
const validationErrors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateForm(): boolean {
  validationErrors.value = { name: '', email: '', password: '', confirmPassword: '' }

  if (!form.value.name.trim()) {
    validationErrors.value.name = '請輸入姓名'
    return false
  }
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
  if (form.value.password.length < 6) {
    validationErrors.value.password = '密碼至少需要 6 個字元'
    return false
  }
  if (form.value.confirmPassword !== form.value.password) {
    validationErrors.value.confirmPassword = '兩次密碼輸入不一致'
    return false
  }

  return true
}

async function handleRegister() {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const token = await apiRegister(form.value)
    // 註冊成功後直接登入（存 token，與 login 流程一致）
    localStorage.setItem('access_token', token)
    authStore.token = token
    router.push('/')
  } catch {
    errorMessage.value = '註冊失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- 頁面背景：與登入頁相同的淺藍紫色 -->
  <div class="min-h-screen bg-primary-50 flex flex-col items-center justify-center px-4">

    <!-- 註冊卡片 -->
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

      <!-- 頂部 Logo 區域 -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4 shadow-md">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="text-2xl font-semibold text-gray-800">建立帳號</h1>
        <p class="text-sm text-gray-500 mt-1">填寫以下資料以完成註冊</p>
      </div>

      <!-- 註冊表單 -->
      <form @submit.prevent="handleRegister" class="space-y-5">

        <!-- 姓名欄位 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              v-model="form.name"
              type="text"
              placeholder="您的姓名"
              autocomplete="name"
              class="w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none transition-colors"
              :class="validationErrors.name
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-200 focus:border-primary-500'"
              @input="validationErrors.name = ''"
            />
          </div>
          <p v-if="validationErrors.name" class="mt-1 text-xs text-red-500">
            {{ validationErrors.name }}
          </p>
        </div>

        <!-- 電子郵件欄位 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
          <div class="relative">
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
              @input="validationErrors.email = ''"
            />
          </div>
          <p v-if="validationErrors.email" class="mt-1 text-xs text-red-500">
            {{ validationErrors.email }}
          </p>
        </div>

        <!-- 密碼欄位 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="至少 6 個字元"
              autocomplete="new-password"
              class="w-full pl-10 pr-12 py-3 border rounded-xl text-sm outline-none transition-colors"
              :class="validationErrors.password
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-200 focus:border-primary-500'"
              @input="validationErrors.password = ''"
            />
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

        <!-- 確認密碼欄位 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">確認密碼</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="再次輸入密碼"
              autocomplete="new-password"
              class="w-full pl-10 pr-12 py-3 border rounded-xl text-sm outline-none transition-colors"
              :class="validationErrors.confirmPassword
                ? 'border-red-400 focus:border-red-500'
                : 'border-gray-200 focus:border-primary-500'"
              @input="validationErrors.confirmPassword = ''"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <svg v-if="!showConfirmPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p v-if="validationErrors.confirmPassword" class="mt-1 text-xs text-red-500">
            {{ validationErrors.confirmPassword }}
          </p>
        </div>

        <!-- API 錯誤提示 -->
        <div v-if="errorMessage"
          class="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {{ errorMessage }}
        </div>

        <!-- 註冊按鈕 -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed
                 text-white py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
        >
          <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          {{ isLoading ? '註冊中...' : '立即註冊' }}
        </button>
      </form>
    </div>

    <!-- 底部連結 -->
    <p class="mt-6 text-sm text-gray-500">
      已有帳號？
      <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">立即登入</router-link>
    </p>
  </div>
</template>
