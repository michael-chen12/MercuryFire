// ========================================
// 應用程式入口文件
// 初始化 Vue App、Pinia、Router
// ========================================

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)

// 注入 Pinia 狀態管理
app.use(createPinia())

// 注入路由
app.use(router)

app.mount('#app')
