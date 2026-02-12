// ========================================
// useDebounce Composable
// 避免搜尋框每次按鍵都觸發 API 請求
// ========================================

import { ref, watch, type Ref } from 'vue'

/**
 * 對響應式資料進行防抖處理
 *
 * @param value - 需要防抖的原始值
 * @param delay - 延遲時間（毫秒），預設 300ms
 * @returns 防抖後的響應式值
 */
export function useDebounce<T>(value: Ref<T>, delay = 300): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout>

  watch(value, (newVal) => {
    // 每次值改變時重置計時器
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = newVal
    }, delay)
  })

  return debouncedValue
}
