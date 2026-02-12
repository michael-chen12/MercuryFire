// ========================================
// 全域 TypeScript 型別定義
// 基於 Swagger API 文件定義所有型別
// ========================================

/**
 * 帳號角色等級 Enum
 * 對應 API 文件中的 RoleLevel 合法值
 */
export enum RoleLevel {
  ADMIN  = 'ADMIN',
  EDITOR = 'EDITOR',
  USER   = 'USER',
  CLIENT = 'CLIENT',
}

/**
 * 帳號狀態 Enum
 * ON = 啟用, OFF = 停用
 */
export enum AccountStatus {
  ON  = 'ON',
  OFF = 'OFF',
}

/**
 * 帳號資料結構（API 回傳）
 */
export interface Account {
  id: string
  name: string
  email: string
  roleLevel: RoleLevel
  status: AccountStatus
  createdAt: string
}

/**
 * 建立 / 更新帳號的表單資料
 */
export interface AccountFormDto {
  name: string
  email: string
  roleLevel: RoleLevel
  status: AccountStatus
}

/**
 * 取得帳號列表的查詢參數
 */
export interface AccountQuery {
  name?: string
  email?: string
}

/**
 * 登入表單資料
 */
export interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

/**
 * API 通用錯誤回應結構
 */
export interface ApiError {
  message: string
  statusCode: number
}

/**
 * 角色中文顯示對應表
 */
export const ROLE_LABEL: Record<RoleLevel, string> = {
  [RoleLevel.ADMIN]:  '管理員',
  [RoleLevel.EDITOR]: '編輯',
  [RoleLevel.USER]:   '用戶',
  [RoleLevel.CLIENT]: '訪客',
}

/**
 * 狀態中文顯示對應表
 */
export const STATUS_LABEL: Record<AccountStatus, string> = {
  [AccountStatus.ON]:  '啟用',
  [AccountStatus.OFF]: '停用',
}
