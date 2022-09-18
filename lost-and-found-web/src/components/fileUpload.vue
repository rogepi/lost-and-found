<template>
  <div>
    <!-- <p class="text-center">hello world</p> -->
    <input
      ref="uploadInput"
      type="file"
      class="dl-none"
      name="icon"
      @change="dealfilechange"
    />
    <button class="btn btn-primary" @click="uploadgogo">
      <span>上传</span>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, ref, onMounted } from 'vue'
import { conditionalExpression } from '@babel/types'

export default defineComponent({
  setup(props, context) {
    const uploadInput = ref<HTMLElement | null>(null)
    const dealfilechange = (e: Event) => {
      const input = e.target as HTMLInputElement
      let files = input.files
      if (files) {
        console.log(files[0])
      }
    }
    // 上传课程
    const uploadgogo = () => {
      // console.log(uploadInput.value)
      let oBtn = uploadInput.value as HTMLInputElement
      oBtn.click()
    }

    return {
      dealfilechange,
      uploadgogo,
      uploadInput, // 要把这个导出去，这样才能够动态绑定
    }
  },
})
</script>

<style>
.dl-none {
  display: none;
}
</style>
