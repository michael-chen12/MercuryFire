<script setup lang="ts">
// ========================================
// 統計數字卡片組件
// 顯示總帳號數、啟用中、已停用
// ========================================

defineProps<{
  // 統計標題
  label: string
  // 統計數值
  value: number
}>()
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 px-6 py-5">
    <p class="text-sm text-gray-500 mb-1">{{ label }}</p>
    <p class="text-2xl font-semibold text-gray-800">{{ value }}</p>
  </div>
</template>
