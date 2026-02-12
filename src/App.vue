<script setup lang="ts">
// 根組件：只負責渲染路由出口
// 所有頁面邏輯都在各自的 View 中處理
</script>

<template>
  <!-- 路由出口：根據當前路徑渲染對應的 View -->
  <RouterView />
</template>
