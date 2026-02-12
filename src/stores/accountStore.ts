// Pinia Store

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '@/api/accounts'
import type { Account, AccountFormDto, AccountQuery } from '@/types'
import { AccountStatus } from '@/types'

export const useAccountStore = defineStore('account', () => {
  // State
  const accounts = ref<Account[]>([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  // Getters 

  // 計算統計數字，避免重複遍歷陣列
  const totalCount = computed(() => accounts.value.length)
  const activeCount = computed(
    () => accounts.value.filter((a) => a.status === AccountStatus.ON).length
  )
  const inactiveCount = computed(
    () => accounts.value.filter((a) => a.status === AccountStatus.OFF).length
  )

  // Actions

  // 取得帳號列表，接受可選的查詢參數
  async function fetchAccounts(query?: AccountQuery): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      accounts.value = await getAccounts(query)
    } catch (err: unknown) {
      errorMessage.value = '無法載入帳號列表，請稍後再試'
      console.error('[accountStore] fetchAccounts error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 新增帳號
  async function addAccount(data: AccountFormDto): Promise<void> {
    isLoading.value = true

    try {
      const newAccount = await createAccount(data)
      accounts.value.push(newAccount)
    } finally {
      isLoading.value = false
    }
  }

  // 編輯帳號
  async function editAccount(id: string, data: AccountFormDto): Promise<void> {
    isLoading.value = true

    try {
      const updated = await updateAccount(id, data)
      const idx = accounts.value.findIndex((a) => a.id === id)
      if (idx !== -1) {
        accounts.value[idx] = updated
      }
    } finally {
      isLoading.value = false
    }
  }

  // 刪除帳號
  async function removeAccount(id: string): Promise<void> {
    isLoading.value = true

    try {
      await deleteAccount(id)
      accounts.value = accounts.value.filter((a) => a.id !== id)
    } finally {
      isLoading.value = false
    }
  }

  return {
    accounts,
    isLoading,
    errorMessage,
    totalCount,
    activeCount,
    inactiveCount,
    fetchAccounts,
    addAccount,
    editAccount,
    removeAccount,
  }
})
