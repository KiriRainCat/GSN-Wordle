import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../../views/HomeView.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../../views/AboutView.vue'),
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('../../views/GameView.vue'),
  },
  {
    path: '/word-bank',
    name: 'word-bank',
    component: () => import('../../views/WordBankView.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../../views/AdminVue.vue'),
  },
]
