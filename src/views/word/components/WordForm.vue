<script setup lang="ts">
import { addWord, getWordById, updateWordInfo } from '@/pkg/services/api'
import { onBeforeMount, reactive, ref } from 'vue'

import { Icon } from '@iconify/vue'
import { Form, Snackbar } from '@varlet/ui'
import { useRoute } from 'vue-router'
import { useStore } from '@/pkg/stores/app'
import type { Word } from '@/pkg/services/api_types'

const store = useStore()
const route = useRoute()

const loading = ref(false)
const props = defineProps({
  id: { type: Number },
  closeFunc: { type: Function, required: true },
})

onBeforeMount(async () => {
  if (props.id) {
    loading.value = true
    const result = await getWordById(props.id)
    word.value = result
    form.word = result.word
    form.subject = result.subject
    form.definition = result.definition
    loading.value = false
  }
})

const word = ref<Word | undefined>()

const formRef = ref<Form>()
const form = reactive({
  word: '',
  subject: '',
  definition: '',
})

async function submitForm() {
  loading.value = true
  if (!(await formRef.value?.validate())) {
    Snackbar({ type: 'error', content: 'Form validation failed!' })
    loading.value = false
    return
  }

  if (props.id) {
    updateWordInfo(props.id, form.subject, form.word, form.definition).then(() => {
      Snackbar({ type: 'success', content: 'Word update request committed successfully!' })
      if (route.name === 'admin') {
        const idx = store.words.findIndex((w) => w.id == word.value?.id)
        word.value!.subject = form.subject
        word.value!.definition = form.definition
        word.value!.word = form.word
        store.words[idx] = word.value!
        props.closeFunc()
        loading.value = false
        return
      }
      location.reload()
    })
    return
  }

  addWord(form.subject, form.word, form.definition).then(() => {
    Snackbar({ type: 'success', content: 'Word addition request committed successfully!' })
    location.reload()
  })
}
</script>

<template>
  <var-loading type="wave" :loading="loading">
    <!-- 用户提示 -->
    <div class="text-xs" v-if="id">P.S. Will be changed after an admin approval</div>
    <div class="text-xs" v-else>P.S. Will be added after an admin approval</div>

    <!-- 数据表单 -->
    <var-form ref="formRef" class="mt-2">
      <var-input v-model="form.word" placeholder="Word" :rules="[(val) => val.length > 2 || 'Length must be greater than 2']" />
      <var-input v-model="form.subject" placeholder="Category" :rules="[(val) => val.length > 2 || 'Length must be greater than 2']" />
      <var-input
        textarea
        v-model="form.definition"
        placeholder="Definition"
        :rules="[(val) => val.length > 2 || 'Length must be greater than 2']"
      />

      <!-- 操作按钮 -->
      <div class="-mb-3 mt-2 text-end">
        <var-button text round @click="submitForm" class="mr-1">
          <Icon icon="line-md:confirm-circle" class="h-6 w-6 text-green-400" />
        </var-button>
        <var-button text round @click="() => closeFunc()">
          <Icon icon="line-md:close-circle" class="h-6 w-6 text-gray-400" />
        </var-button>
      </div>
    </var-form>
  </var-loading>
</template>

<style scoped lang="scss"></style>
