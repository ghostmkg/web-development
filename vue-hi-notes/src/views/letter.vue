<template>
  <div class="container-envelope">
    <div class="max-w-xl bg-[#f9f9f9] rounded-lg text-center align-middle flex items-center py-5 px-7 flex-col gap-5 shadow-lg">
      <div class="flex text-gray-300 items-center gap-3">
        <hr class="w-12 h-0.5 rounded-sm border-0 bg-gray-300" />
        <p class="tangerine-bold text-3xl">Quote</p>
        <hr class="w-12 h-0.5 rounded-sm border-0 bg-gray-300" />
      </div>
      <p class="tangerine-italic lg:text-[4rem] text-[3rem]">{{ searchLetter && searchLetter.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import letterJson from "../data/letter.json";
import { ref, onMounted } from "vue";

interface Letter {
  text: string;
}

const searchLetter = ref<Letter>();

onMounted(() => {
  searchLetter.value = letterJson[Math.floor(Math.random() * letterJson.length)];
});
</script>
