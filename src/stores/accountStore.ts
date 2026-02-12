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
  const lastQuery = ref<AccountQuery | undefined>(undefined)

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
    lastQuery.value = query

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
    errorMessage.value = ''

    try {
      await createAccount(data)
      accounts.value = await getAccounts(lastQuery.value)
    } catch (err: unknown) {
      errorMessage.value = '新增帳號失敗，請稍後再試'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 編輯帳號
  async function editAccount(id: string, data: AccountFormDto): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      await updateAccount(id, data)
      accounts.value = await getAccounts(lastQuery.value)
    } catch (err: unknown) {
      errorMessage.value = '更新帳號失敗，請稍後再試'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 刪除帳號
  async function removeAccount(id: string): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      await deleteAccount(id)
      accounts.value = await getAccounts(lastQuery.value)
    } catch (err: unknown) {
      errorMessage.value = '刪除帳號失敗，請稍後再試'
      throw err
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
