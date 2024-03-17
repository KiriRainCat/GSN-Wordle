<script setup lang="ts">
import type { Commit, Word } from '@/pkg/services/api_types'
import { type PropType } from 'vue'

import { Icon } from '@iconify/vue'
import { approveCommit, deleteCommit } from '@/pkg/services/api'

const props = defineProps({
  word: {
    type: Object as PropType<Word>,
    required: true,
  },
  commit: {
    type: Object as PropType<Commit>,
    required: true,
  },
})

function handleApproveCommit() {
  approveCommit(props.commit.id)
  location.reload()
}

function handleDeleteCommit() {
  deleteCommit(props.commit.id)
  location.reload()
}
</script>

<template>
  <var-paper :elevation="2" class="max-w-[36rem] translate-x-0 break-inside-avoid p-4">
    <!-- 变更信息对比 -->
    <div class="flex">
      <div>
        <div class="text-xl font-bold">{{ word.word }}</div>
        <div class="-mt-1.5 text-sm text-gray-400">{{ word.subject }}</div>
        <div class="mb-5 mt-0.5">{{ word.definition }}</div>
      </div>

      <var-divider vertical />

      <div class="ml-6">
        <div class="text-xl font-bold">{{ commit.word }}</div>
        <div class="-mt-1.5 text-sm text-gray-400">{{ commit.subject }}</div>
        <div class="mb-5 mt-0.5">{{ commit.definition }}</div>
      </div>
    </div>

    <!-- 操作按钮 [批准(管理员)，删除(管理员)] -->
    <div class="absolute right-2 top-2">
      <var-menu trigger="hover" placement="bottom">
        <var-button text round>
          <Icon icon="icon-park:more-two" class="h-5 w-5" />
        </var-button>

        <template #menu>
          <div class="flex flex-col gap-1 px-1 py-1.5">
            <!-- 批准按钮 -->
            <var-tooltip v-if="!word.active" trigger="hover" content="Approve" placement="right">
              <var-button text round @click="handleApproveCommit">
                <Icon icon="mdi:tag-approve-outline" class="h-6 w-6 text-emerald-400" />
              </var-button>
            </var-tooltip>

            <!-- 删除按钮 -->
            <var-tooltip trigger="hover" content="Reject" placement="right">
              <var-button text round @click="handleDeleteCommit">
                <Icon icon="mdi:tag-remove-outline" class="h-6 w-6 text-red-400" />
              </var-button>
            </var-tooltip>
          </div>
        </template>
      </var-menu>
    </div>

    <!-- 时间信息 -->
    <div class="absolute bottom-2 right-3 text-end text-xs text-gray-500">
      <div>Proposed: {{ new Date(Date.parse(commit.created_at)).toLocaleString() }}</div>
    </div>
  </var-paper>
</template>

<style scoped lang="scss"></style>
