<script setup lang="ts">
</script>

<template>
  <div class="m-5">
    <el-config-provider>
      <router-view></router-view>
    </el-config-provider>
  </div>
  <!-- <TheFooter></TheFooter> -->
</template>

<style lang="scss">
.m-5 {
  height: 100%;
}

#app {
  height: 100%;
}
</style>
