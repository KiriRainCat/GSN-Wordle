<script setup lang="ts">
import { authAdmin, getCommits, getWordList } from '@/pkg/services/api'
import { onBeforeMount, ref } from 'vue'

import { Icon } from '@iconify/vue'
import WordCard from './components/WordCard.vue'
import { useRouter } from 'vue-router'
import CommitCard from './components/CommitCard.vue'
import { useStore } from '@/pkg/stores/app'

const store = useStore()
const router = useRouter()

const activeTab = ref(0)

const showAuthDialog = ref(true)

const isLoading = ref(true)
onBeforeMount(authAndFetchData)

const adminPassword = ref('')
const isAuthenticating = ref(false)

async function authAndFetchData(password?: string) {
  isAuthenticating.value = true
  if (await authAdmin(password ?? localStorage.getItem('adminPassword') ?? '')) {
    showAuthDialog.value = false
    isLoading.value = true
    store.words = await getWordList()
    store.commits = await getCommits()
    isLoading.value = false
  }
  isAuthenticating.value = false
}

function logout() {
  localStorage.setItem('adminPassword', '')
  router.replace('/')
}
</script>

<template>
  <div id="word-bank" class="flex h-screen flex-col items-center px-6">
    <!-- 验证管理员密码的弹窗 -->
    <var-dialog
      v-model:show="showAuthDialog"
      title="Authenticate as an Administrator"
      :confirm-button="false"
      :cancel-button="false"
      :close-on-click-overlay="false"
    >
      <var-loading :loading="isAuthenticating">
        <div class="flex flex-col justify-center">
          <var-input v-model="adminPassword" placeholder="Admin Password" />
          <var-button type="primary" @click="() => authAndFetchData(adminPassword)" class="mt-4">Authenticate</var-button>
        </div>
      </var-loading>
    </var-dialog>

    <!-- 页面顶部栏 -->
    <div class="mt-6 flex justify-center border-0 border-b-[1.6px] border-solid border-b-slate-300">
      <!-- 返回按钮 -->
      <var-tooltip trigger="hover" content="Go home">
        <var-button text round @click="() => $router.push('/')">
          <Icon icon="mdi:home" class="h-6 w-6 text-cyan-400" />
        </var-button>
      </var-tooltip>

      <!-- 页面标题 -->
      <var-tooltip trigger="hover" content="Click to refresh">
        <var-button text @click="() => authAndFetchData()" class="mx-2 mb-2 mt-0.5 text-2xl font-bold">Admin Panel</var-button>
      </var-tooltip>

      <!-- 登出按钮 -->
      <var-tooltip trigger="hover" content="Logout">
        <var-button text round @click="logout" class="-ml-0.5">
          <Icon icon="pepicons-print:leave" class="h-6 w-6 text-pink-400" />
        </var-button>
      </var-tooltip>
    </div>

    <!-- 选项卡切换 -->
    <var-tabs v-model:active="activeTab" class="my-6">
      <var-tab>Pending Words</var-tab>
      <var-tab>Pending Commits</var-tab>
      <var-tab>Active Words</var-tab>
    </var-tabs>

    <!-- 选项卡内容 -->
    <var-loading type="wave" :loading="isLoading" class="w-full">
      <var-tabs-items v-model:active="activeTab" :can-swipe="false">
        <!-- 待审核单词 -->
        <var-tab-item>
          <div class="grid max-h-[78vh] grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-x-3 gap-y-5 !overflow-auto py-1">
            <WordCard v-for="word in store.words.filter((w) => !w.active)" :key="word.id" :word="word" />
          </div>
        </var-tab-item>

        <!-- 待批注提交 -->
        <var-tab-item>
          <div class="grid max-h-[78vh] grid-cols-[repeat(auto-fit,minmax(32rem,1fr))] gap-x-3 gap-y-5 !overflow-auto py-1">
            <CommitCard
              v-for="commit in store.commits"
              :key="commit.id"
              :commit="commit"
              :word="store.words.find((w) => w.id == commit.wid)!"
            />
          </div>
        </var-tab-item>

        <!-- 已批准的单词 -->
        <var-tab-item>
          <div class="grid max-h-[78vh] grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-x-3 gap-y-5 !overflow-auto py-1">
            <WordCard v-for="word in store.words.filter((w) => w.active)" :key="word.id" :word="word" />
          </div>
        </var-tab-item>
      </var-tabs-items>
    </var-loading>
  </div>
</template>

<style scoped lang="scss"></style>
