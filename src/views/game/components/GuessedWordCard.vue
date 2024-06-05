<script setup lang="ts">
import { useStore } from '@/pkg/stores/app'
import { computed } from 'vue'

const store = useStore()

const props = defineProps({
  guess: {
    type: String,
    required: true,
  },
  mini: {
    type: Boolean,
    default: false,
  },
  quardleIdx: {
    type: Number,
  },
})

const word = computed(() => {
  if (props.quardleIdx == undefined) {
    return store.word
  } else {
    return store.quardleWords![props.quardleIdx]
  }
})
</script>

<template>
  <div elevation class="flex gap-1 font-mono font-bold" :class="mini ? 'mt-1.5 text-[0.65rem]' : 'mt-3.5 text-lg'">
    <div v-for="(letter, idx) in word?.word + '???'" :key="idx">
      <div v-if="letter === ' '" :class="mini ? 'mx-[1.05rem]' : 'mx-3'"></div>

      <div
        v-else
        :class="
          `${store.getLetterColorClass(guess[idx] ?? '!', idx, quardleIdx)}` +
          (guess[idx] ? '' : ` bg-gray-50 ${mini ? `!px-[0.91rem]` : `!px-[1.311rem]`} ${mini ? `!py-[0.91rem]` : `!py-6`}`) +
          (guess[idx] === ' ' ? ` ${mini ? `!px-[0.91rem] !py-[0.91rem]` : `!px-[1.311rem] !py-6`}` : '') +
          ((word?.word + '???')[idx] === '?' ? ' opacity-25' : '') +
          (mini ? ' px-[0.732rem] py-[0.53rem]' : ' px-4 py-2.5')
        "
        class="rounded-md border-solid border-zinc-600 border-opacity-40 bg-opacity-75"
      >
        {{ (guess[idx] ?? '').toUpperCase() }}
      </div>
    </div>
  </div>
</template>
