// ========================================
// Vue Router 路由設定
// 包含路由守衛（auth guard）防止未登入訪問
// ========================================

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    // 已登入者重定向到首頁
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    // 已登入者重定向到首頁
    meta: { guestOnly: true },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    // 需要登入才能訪問
    meta: { requiresAuth: true },
  },
  {
    // 攔截所有未知路徑，跳回首頁
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ── 全局前置守衛 ──────────────────────────
// 每次路由切換前檢查登入狀態
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token')
  const isLoggedIn = !!token

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 未登入 → 跳轉登入頁
    next('/login')
  } else if (to.meta.guestOnly && isLoggedIn) {
    // 已登入 → 不允許訪問登入頁
    next('/')
  } else {
    next()
  }
})

export default router
