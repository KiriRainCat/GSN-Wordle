import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './pkg/router'

// Varlet UI
import Varlet, { Snackbar } from '@varlet/ui'
import '@varlet/ui/es/style'
Snackbar.allowMultiple(true)

// 全局样式
import './assets/styles.scss'

createApp(App).use(router).use(createPinia()).use(Varlet).mount('#app')
