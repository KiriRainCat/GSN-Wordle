<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-center">
    <div class="my-6 text-xl font-bold">About 「Georgiadle」</div>

    <div class="mb-0.5 text-lg">Contributors:</div>
    <div>Sam Zhou (Developer)</div>
    <div>Yewon Seo (Designer)</div>
    <div>Ethan Hoo (Contributor)</div>
    <div>All members in our SLP group at GSN during 2024</div>
    

    <div class="mt-4 mb-1 text-lg">Develop Time:</div>

    <div>
      <div class="mr-2">Website:</div>
      <a href="https://wakatime.com/badge/user/c4514f01-2455-4665-8c86-194659ba07a6/project/018e3f83-590f-49e7-b212-cdd2d775f634">
        <img
          src="https://wakatime.com/badge/user/c4514f01-2455-4665-8c86-194659ba07a6/project/018e3f83-590f-49e7-b212-cdd2d775f634.svg"
          alt="wakatime"
        />
      </a>

      <div class="mr-2 mt-2">Server:</div>
      <a href="https://wakatime.com/badge/user/c4514f01-2455-4665-8c86-194659ba07a6/project/018e4170-dad5-482e-bfe3-aa1887cecb7d">
        <img
          src="https://wakatime.com/badge/user/c4514f01-2455-4665-8c86-194659ba07a6/project/018e4170-dad5-482e-bfe3-aa1887cecb7d.svg"
          alt="wakatime"
        />
      </a>
    </div>

    <var-button @click="() => $router.back()" class="mt-8">Back to Home</var-button>
  </div>
</template>

<style lang="scss" scoped></style>
