<template>
  <div class="container-envelope">
    <div class="wrapper shadow-lg">
      <div class="lid one"></div>
      <div class="lid two"></div>
      <div class="envelope"></div>
      <div class="letter">
        <div class="w-full text-center text-xl">
          <router-link :to="{ name: 'letter' }" class="w-full z-40 tangerine-bold text-[3rem]"> Click Me </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//
</script>
