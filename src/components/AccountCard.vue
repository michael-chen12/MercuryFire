<script setup lang="ts">
// ========================================
// 帳號資訊卡片組件
// 顯示單一帳號的詳細資料，含編輯/刪除操作
// ========================================

import type { Account } from '@/types'
import { AccountStatus, ROLE_LABEL, STATUS_LABEL } from '@/types'

const props = defineProps<{
  account: Account
  // 刪除時顯示 loading 狀態
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  // 觸發編輯 Modal
  (e: 'edit', account: Account): void
  // 觸發刪除確認
  (e: 'delete', id: string): void
}>()

// 根據狀態動態返回 badge 樣式類別
function getStatusClass(status: AccountStatus): string {
  return status === AccountStatus.ON
    ? 'bg-green-100 text-green-700'
    : 'bg-gray-200 text-gray-600'
}

// 格式化日期：將 ISO 格式轉換為 YYYY-MM-DD
function formatDate(dateStr: string): string {
  return dateStr ? dateStr.substring(0, 10) : '-'
}
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4
              hover:shadow-md transition-shadow duration-200">

    <!-- 上方：頭像 + 姓名 + 狀態 -->
    <div class="flex items-center gap-3">
      <!-- 紫色圓形頭像 -->
      <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      <div class="min-w-0">
        <h3 class="font-semibold text-gray-800 truncate">{{ account.name }}</h3>
        <!-- 狀態 Badge -->
        <span
          class="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium"
          :class="getStatusClass(account.status)"
        >
          {{ STATUS_LABEL[account.status] }}
        </span>
      </div>
    </div>

    <!-- 中間：詳細資訊列表 -->
    <div class="space-y-2 text-sm text-gray-600">
      <!-- 電子郵件 -->
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span class="truncate">{{ account.email }}</span>
      </div>

      <!-- 角色 -->
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>{{ ROLE_LABEL[account.roleLevel] }}</span>
      </div>

      <!-- 建立日期 -->
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ formatDate(account.createdAt) }}</span>
      </div>
    </div>

    <!-- 下方：操作按鈕 -->
    <div class="flex gap-2 pt-1 border-t border-gray-100">
      <!-- 編輯按鈕 -->
      <button
        class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
               text-sm text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
        @click="emit('edit', props.account)"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        編輯
      </button>

      <!-- 刪除按鈕 -->
      <button
        class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
               text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-colors
               disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isDeleting"
        @click="emit('delete', props.account.id)"
      >
        <svg v-if="isDeleting" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        刪除
      </button>
    </div>
  </div>
</template>
