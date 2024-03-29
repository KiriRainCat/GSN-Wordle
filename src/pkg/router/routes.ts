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
    children: [
      { path: 'daily', name: 'daily', component: () => import('../../views/game/DailyGameView.vue') },
      { path: 'random', name: 'random', component: () => import('../../views/game/RandomGameView.vue') },
    ],
  },
  {
    path: '/word-bank',
    name: 'word-bank',
    component: () => import('../../views/word/WordBankView.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../../views/word/AdminVue.vue'),
  },
]
