<template>
  <div class="text-center">
    <el-tooltip content="GitHub" placement="top">
      <a class="icon-btn mx-2" href="https://github.com/nekobc1998923/vitecamp" target="_blank" title="GitHub">
        <i-akar-icons-github-fill class="icon-footer" />
      </a>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { isDark, toggleDark } from '@/utils/dark';

</script>

<style lang="scss">
.icon-footer {
  font-size: 1.3em;
}
</style>
