// 帳號相關 API

import http from './http'
import type { Account, AccountFormDto, AccountQuery } from '@/types'

/// 取得帳號列表
export function getAccounts(query?: AccountQuery): Promise<Account[]> {
  return http.get<Account[]>('/accounts', { params: query })
    .then((res) => res.data)
}

// 取得單一帳號資料
export function getAccount(id: string): Promise<Account> {
  return http.get<Account>(`/account/${id}`)
    .then((res) => res.data)
}

// 新增帳號
export function createAccount(data: AccountFormDto): Promise<Account> {
  return http.post<Account>('/create-account', data)
    .then((res) => res.data)
}

// 更新帳號
export function updateAccount(id: string, data: AccountFormDto): Promise<Account> {
  return http.patch<Account>(`/update-account/${id}`, data)
    .then((res) => res.data)
}

// 刪除帳號
export function deleteAccount(id: string): Promise<void> {
  return http.delete(`/delete-account/${id}`)
    .then(() => undefined)
}
