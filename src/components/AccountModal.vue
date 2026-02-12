<script setup lang="ts">
// ========================================
// 新增/編輯帳號 Modal 組件
// 使用 defineModel（Vue 3.4+）實現雙向綁定
// ========================================

import { ref, watch, computed } from 'vue'
import type { Account, AccountFormDto } from '@/types'
import { RoleLevel, AccountStatus, ROLE_LABEL, STATUS_LABEL } from '@/types'

// ── Props & Emits ───────────────────────

// 使用 defineModel 控制 Modal 顯示/隱藏（加分項目）
const visible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  // 傳入 account 表示編輯模式，否則為新增模式
  editTarget?: Account | null
  // 提交時的 loading 狀態
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: AccountFormDto): void
}>()

// ── 表單狀態 ────────────────────────────

// 初始空白表單
const emptyForm = (): AccountFormDto => ({
  name: '',
  email: '',
  roleLevel: RoleLevel.USER,
  status: AccountStatus.ON,
})

const form = ref<AccountFormDto>(emptyForm())

// 表單驗證錯誤
const errors = ref({ name: '', email: '' })

// 根據是否有 editTarget 判斷模式
const isEditMode = computed(() => !!props.editTarget)
const modalTitle = computed(() => isEditMode.value ? '編輯帳號' : '新增帳號')
const submitLabel = computed(() => isEditMode.value ? '儲存變更' : '新增帳號')

// 角色選項列表
const roleOptions = Object.values(RoleLevel).map((v) => ({
  value: v,
  label: ROLE_LABEL[v],
}))

// 狀態選項列表
const statusOptions = Object.values(AccountStatus).map((v) => ({
  value: v,
  label: STATUS_LABEL[v],
}))

// ── Watch ────────────────────────────────

// 當 editTarget 變更時，同步填入表單資料
watch(
  () => props.editTarget,
  (target) => {
    if (target) {
      form.value = {
        name:      target.name,
        email:     target.email,
        roleLevel: target.roleLevel,
        status:    target.status,
      }
    } else {
      form.value = emptyForm()
    }
    // 切換資料時清空驗證錯誤
    errors.value = { name: '', email: '' }
  },
  { immediate: true }
)

// ── 方法 ─────────────────────────────────

// Email 格式驗證
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 提交前驗證
function validateForm(): boolean {
  errors.value = { name: '', email: '' }

  if (!form.value.name.trim()) {
    errors.value.name = '請輸入姓名'
    return false
  }
  if (!form.value.email) {
    errors.value.email = '請輸入電子郵件'
    return false
  }
  if (!validateEmail(form.value.email)) {
    errors.value.email = '請輸入有效的電子郵件格式'
    return false
  }

  return true
}

function handleSubmit() {
  if (!validateForm()) return
  emit('submit', { ...form.value })
}

function handleClose() {
  visible.value = false
  form.value = emptyForm()
  errors.value = { name: '', email: '' }
}
</script>

<template>
  <!-- Modal 遮罩層：點擊背景可關閉 -->
  <Transition name="modal">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="handleClose"
    >
      <!-- 半透明背景 -->
      <div class="absolute inset-0 bg-black/50" @click="handleClose" />

      <!-- Modal 本體 -->
      <div class="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        <!-- Modal 標題列 -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-800">{{ modalTitle }}</h2>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400
                   hover:text-gray-600 hover:bg-gray-100 transition-colors"
            @click="handleClose"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 表單內容 -->
        <div class="px-6 py-5 space-y-4">

          <!-- 姓名 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              姓名 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="請輸入姓名"
              class="w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors"
              :class="errors.name ? 'border-red-400' : 'border-gray-200 focus:border-primary-500'"
            />
            <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
          </div>

          <!-- 電子郵件 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              電子郵件 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="email@example.com"
              class="w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors"
              :class="errors.email ? 'border-red-400' : 'border-gray-200 focus:border-primary-500'"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
          </div>

          <!-- 角色 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              角色 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.roleLevel"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none
                     focus:border-primary-500 bg-white transition-colors appearance-none cursor-pointer"
            >
              <option
                v-for="opt in roleOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- 狀態 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              狀態 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none
                     focus:border-primary-500 bg-white transition-colors appearance-none cursor-pointer"
            >
              <option
                v-for="opt in statusOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- 按鈕列 -->
        <div class="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            class="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600
                   hover:bg-gray-50 transition-colors"
            @click="handleClose"
          >
            取消
          </button>
          <button
            type="button"
            :disabled="isSubmitting"
            class="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm
                   font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
            @click="handleSubmit"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ submitLabel }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal 淡入淡出動畫 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
