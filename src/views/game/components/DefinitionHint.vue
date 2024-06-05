<script setup lang="ts">
import { MAXIMUM_TRIES as TRIES } from '@/pkg/services/game_logic'
import { useStore } from '@/pkg/stores/app'
import { computed, onMounted, ref } from 'vue'

const store = useStore()

function computeLetterToBeDisplayed(letter: string, quardleIdx?: number): string {
  if (letter === ' ') return ' '

  if (currentTryLength.value >= MAXIMUM_TRIES - 1) return letter

  if ((props.isQuardleMode ? store.quardleTries?.join('') ?? '' : store.tries.join('')).includes(letter)) {
    if (currentTryLength.value >= MAXIMUM_TRIES - 2) return letter
    if (!store.getLetterColorClass(letter, 0, quardleIdx).includes('gray')) return letter
  }

  return '_'
}

let MAXIMUM_TRIES = TRIES
const props = defineProps({ isQuardleMode: { type: Boolean, default: false } })
onMounted(() => props.isQuardleMode && (MAXIMUM_TRIES += 2))

const currentTryLength = computed(() =>
  props.isQuardleMode ? store.quardleTries!.concat([]).sort((a, b) => b.length - a.length)[0].length : store.tries.length ?? 0
)

const activeDefinitionIdx = ref(0)
</script>

<template>
  <div class="break-words" :class="isQuardleMode ? 'max-w-[28rem]' : 'max-w-96'">
    <var-paper elevation v-if="!(currentTryLength >= MAXIMUM_TRIES / 2)" class="p-3 text-xs">
      Definition will be revealed in
      {{ MAXIMUM_TRIES / 2 - currentTryLength }}
      tries
    </var-paper>

    <div v-else>
      <!-- Quardle 模式下的多个提示 -->
      <div v-if="isQuardleMode" class="flex items-center gap-3">
        <!-- 上一组按钮 -->
        <var-button
          text
          size="mini"
          class="h-20 min-w-8 text-base"
          :disabled="activeDefinitionIdx <= 0"
          @click="() => activeDefinitionIdx--"
        >
          ←
        </var-button>

        <!-- 当前组提示 -->
        <div>
          <div v-for="i in [0, 1, 2, 3]" :key="i">
            <var-paper elevation v-if="activeDefinitionIdx == i" class="p-3 text-lg tracking-widest">
              <span v-for="(letter, idx) in store.quardleWords?.[i].definition" :key="idx">
                {{ computeLetterToBeDisplayed(letter, i) }}
              </span>
            </var-paper>
          </div>
        </div>

        <!-- 下一组按钮 -->
        <var-button text size="mini" class="h-20 min-w-8 text-base" :disabled="activeDefinitionIdx >= 3" @click="activeDefinitionIdx++">
          →
        </var-button>
      </div>

      <!-- 正常模式下的提示 -->
      <var-paper elevation v-else class="p-3 text-lg tracking-widest">
        <span v-for="(letter, i) in store.word?.definition" :key="i">
          {{ computeLetterToBeDisplayed(letter) }}
        </span>
      </var-paper>
    </div>
  </div>
</template>
