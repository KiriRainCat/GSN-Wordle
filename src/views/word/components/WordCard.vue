<script setup lang="ts">
import type { Word } from '@/pkg/services/api_types'
import { ref, type PropType } from 'vue'
import { deleteWord, setActiveState } from '@/pkg/services/api'
import { useStore } from '@/pkg/stores/app'

import { Icon } from '@iconify/vue'
import WordForm from './WordForm.vue'

const store = useStore()

const props = defineProps({
  word: {
    type: Object as PropType<Word>,
    required: true,
  },
})

const showEditWordDialog = ref(false)

async function handleSetActiveState(active: boolean) {
  try {
    await setActiveState(props.word.id, active)
  } catch (_) {
    return
  }

  store.words.find((w) => w.id == props.word.id)!.active = active
}

const showDeleteConfirmDialog = ref(false)
async function handleDeleteWord() {
  try {
    deleteWord(props.word.id)
  } catch (_) {
    return
  }
  store.words = store.words.filter((w) => w.id != props.word.id)
}
</script>

<template>
  <!-- 编辑对话框 -->
  <var-dialog v-model:show="showEditWordDialog" title="Edit Word" :cancel-button="false" :confirm-button="false" class="w-96">
    <WordForm :id="word.id" :close-func="() => (showEditWordDialog = false)" />
  </var-dialog>

  <!-- 单词卡 -->
  <var-paper :elevation="2" class="translate-x-0 break-inside-avoid p-4">
    <!-- 单词基本信息 -->
    <div class="text-xl font-bold">{{ word.word }}</div>
    <div class="-mt-1.5 text-sm text-gray-400">{{ word.subject }}</div>
    <div class="mb-5 mt-0.5">{{ word.definition }}</div>

    <!-- 单词操作按钮 [编辑，批准(管理员)，删除(管理员)] -->
    <div class="absolute right-2 top-2">
      <var-tooltip v-if="$route.name !== 'admin'" trigger="hover" content="Edit" placement="right">
        <var-button text round @click="() => (showEditWordDialog = true)">
          <Icon icon="tabler:edit" class="h-6 w-6 text-emerald-500" />
        </var-button>
      </var-tooltip>

      <!-- 管理员界面显示的操作菜单 -->
      <var-menu v-else trigger="hover" placement="bottom">
        <var-button text round>
          <Icon icon="icon-park:more-two" class="h-5 w-5" />
        </var-button>

        <template #menu>
          <div class="flex flex-col gap-1 px-1 py-1.5">
            <!-- 编辑按钮 -->
            <var-tooltip trigger="hover" content="Edit" placement="right">
              <var-button text round @click="() => (showEditWordDialog = true)">
                <Icon icon="tabler:edit" class="h-6 w-6 text-cyan-400" />
              </var-button>
            </var-tooltip>

            <!-- 更改否激活状态的按钮组 -->
            <var-tooltip v-if="!word.active" trigger="hover" content="Mark active" placement="right">
              <var-button text round @click="() => handleSetActiveState(true)">
                <Icon icon="mdi:tag-approve-outline" class="h-6 w-6 text-emerald-400" />
              </var-button>
            </var-tooltip>
            <var-tooltip v-else trigger="hover" content="Mark inactive" placement="right">
              <var-button text round @click="() => handleSetActiveState(false)">
                <Icon icon="mdi:tag-remove-outline" class="h-6 w-6 text-red-400" />
              </var-button>
            </var-tooltip>

            <!-- 删除按钮 -->
            <var-dialog
              v-model:show="showDeleteConfirmDialog"
              title="Delete Word"
              message="Are you sure?"
              @cancel="() => (showDeleteConfirmDialog = false)"
              @confirm="handleDeleteWord"
            />
            <var-tooltip trigger="hover" content="Delete" placement="right">
              <var-button text round @click="() => (showDeleteConfirmDialog = true)">
                <Icon icon="pajamas:remove" class="h-5 w-5 text-red-400" />
              </var-button>
            </var-tooltip>
          </div>
        </template>
      </var-menu>
    </div>

    <!-- 单词时间信息 -->
    <div class="absolute bottom-2 right-3 text-end text-[0.5rem] text-gray-300">
      <div>Created: {{ new Date(Date.parse(word.created_at)).toLocaleString() }}</div>
      <div>Updated: {{ new Date(Date.parse(word.updated_at)).toLocaleString() }}</div>
    </div>
  </var-paper>
</template>

<style scoped lang="scss"></style>
