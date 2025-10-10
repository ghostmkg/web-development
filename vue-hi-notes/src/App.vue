<script setup lang="ts">
import { HeartIcon } from "@heroicons/vue/24/outline";
</script>

<template>
  <div>
    <header class="w-full p-1">
      <nav class="items-center w-full flex justify-center md:w-auto md:order-1">
        <ul class="flex gap-5 font-medium p-2">
          <li>
            <router-link :to="{ name: 'welcome' }" class="block rounded-sm text-[#e3ba8b] rubik-regular" aria-current="page"> Welcome </router-link>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </router-view>
    </main>
    <footer class="w-full font-bold p-1">
      <p class="flex gap-2 text-sm text-[#e3ba8b] justify-center rubik-regular">
        Made by People to People
        <span>
          <HeartIcon class="size-5 text-[#e3ba8b]" />
        </span>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
