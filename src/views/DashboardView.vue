<script setup lang="ts">
// ========================================
// 帳號管理主頁面
// 包含搜尋、統計、帳號卡片列表、CRUD 操作
// ========================================

import { ref, watch, computed, onMounted } from 'vue'
import { useAccountStore } from '@/stores/accountStore'
import AppHeader from '@/components/AppHeader.vue'
import StatCard from '@/components/StatCard.vue'
import AccountCard from '@/components/AccountCard.vue'
import AccountModal from '@/components/AccountModal.vue'
import type { Account, AccountFormDto } from '@/types'

const accountStore = useAccountStore()

// ── 搜尋相關 ────────────────────────────
const searchQuery = ref('')

// 客戶端過濾：對 name 或 email 進行 OR 模糊比對
// API 的 name/email 參數是 AND 邏輯，不適合做聯合搜尋
const filteredAccounts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return accountStore.accounts
  return accountStore.accounts.filter(
    (a: Account) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
  )
})

// ── Modal 相關 ───────────────────────────
const isModalVisible = ref(false)
// null = 新增模式；Account = 編輯模式
const editTarget = ref<Account | null>(null)
// 正在刪除的帳號 id（顯示 loading 狀態）
const deletingId = ref<string | null>(null)

// Modal 關閉時清除編輯目標，避免再次編輯同一筆資料時 watch 不觸發
watch(isModalVisible, (visible) => {
  if (!visible) {
    editTarget.value = null
  }
})

// 開啟新增 Modal
function openCreateModal() {
  editTarget.value = null
  isModalVisible.value = true
}

// 開啟編輯 Modal
function openEditModal(account: Account) {
  editTarget.value = account
  isModalVisible.value = true
}

// 表單提交：依據模式判斷呼叫新增或更新
async function handleSubmit(data: AccountFormDto) {
  try {
    if (editTarget.value) {
      await accountStore.editAccount(editTarget.value.id, data)
    } else {
      await accountStore.addAccount(data)
    }
    isModalVisible.value = false
  } catch (err) {
    console.error('[DashboardView] handleSubmit error:', err)
  }
}

// 刪除帳號（帶防呆：避免重複點擊）
async function handleDelete(id: string) {
  if (deletingId.value) return

  if (!window.confirm('確定要刪除此帳號嗎？此操作無法復原。')) return

  deletingId.value = id
  try {
    await accountStore.removeAccount(id)
  } catch (err) {
    console.error('[DashboardView] handleDelete error:', err)
  } finally {
    deletingId.value = null
  }
}

// ── 頁面初始化 ───────────────────────────
onMounted(() => {
  accountStore.fetchAccounts()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- 頂部導覽列 -->
    <AppHeader />

    <!-- 主要內容區 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      <!-- 搜尋列 + 新增按鈕 -->
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- 搜尋框 -->
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜尋帳號（姓名、郵件、角色）..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm
                   outline-none focus:border-primary-500 transition-colors bg-white"
          />
        </div>

        <!-- 新增帳號按鈕 -->
        <button
          class="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700
                 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
          @click="openCreateModal"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新增帳號
        </button>
      </div>

      <!-- 統計卡片區 -->
      <div class="grid grid-cols-3 gap-4">
        <StatCard label="總帳號數" :value="accountStore.totalCount" />
        <StatCard label="啟用中"   :value="accountStore.activeCount" />
        <StatCard label="已停用"   :value="accountStore.inactiveCount" />
      </div>

      <!-- 帳號列表 -->
      <div>
        <!-- 載入中 Skeleton -->
        <div v-if="accountStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="i in 3" :key="i"
            class="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-gray-200 rounded-full" />
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-1/2" />
                <div class="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
            <div class="space-y-2">
              <div class="h-3 bg-gray-100 rounded" />
              <div class="h-3 bg-gray-100 rounded w-3/4" />
              <div class="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        </div>

        <!-- 錯誤提示 -->
        <div
          v-else-if="accountStore.errorMessage"
          class="text-center py-12 text-gray-500"
        >
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{{ accountStore.errorMessage }}</p>
          <button
            class="mt-3 text-primary-600 text-sm hover:underline"
            @click="accountStore.fetchAccounts()"
          >
            重新載入
          </button>
        </div>

        <!-- 空狀態 -->
        <div
          v-else-if="filteredAccounts.length === 0"
          class="text-center py-16 text-gray-400"
        >
          <svg class="w-14 h-14 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="text-sm">目前沒有帳號資料</p>
          <button
            class="mt-3 text-primary-600 text-sm hover:underline"
            @click="openCreateModal"
          >
            新增第一個帳號
          </button>
        </div>

        <!-- 帳號卡片網格（RWD：手機1欄、平板2欄、桌面3欄）-->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AccountCard
            v-for="account in filteredAccounts"
            :key="account.id"
            :account="account"
            :is-deleting="deletingId === account.id"
            @edit="openEditModal"
            @delete="handleDelete"
          />
        </div>
      </div>
    </main>

    <!-- 新增/編輯帳號 Modal -->
    <AccountModal
      v-model:visible="isModalVisible"
      :edit-target="editTarget"
      :is-submitting="accountStore.isLoading"
      @submit="handleSubmit"
    />
  </div>
</template>
