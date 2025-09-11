<template>
  <div class="select-with-prefix">
    <field-info v-if="fieldCode" :fieldCode="fieldCode"></field-info>
    <div class="select-prefix">{{ prefix }}</div>
    <el-select :model-value="modelValue" @update:model-value="handleInput" :style="{ width: width }" v-bind="$attrs" @change="handleChange">
      <slot>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
      </slot>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { IDropBean } from '@/utils/model/jsonModelInterface';
import fieldInfo from '@/views/home/fieldInfo.vue';

interface Props {
  modelValue?: string;
  options?: any[] | IDropBean[];
  prefix?: string;
  width?: string;
  fieldCode?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  prefix: '',
  width: '200px',
});

const emit = defineEmits<Emits>();

const handleInput = (value: string) => {
  emit('update:modelValue', value);
};
const handleChange = (value: string) => {
  emit('change', value);
};
</script>

import
<style lang="scss">
.select-with-prefix {
  display: inline-block;
  margin: 5px;
  .select-prefix {
    padding: 0px 20px 0px 20px;
    position: relative;
    vertical-align: middle;
    text-align: center;
    background-color: var(--el-fill-color-light);

    align-items: center;
    border-radius: var(--el-border-radius-base);
    color: var(--el-color-info);
    display: inline-flex;
    justify-content: center;
    white-space: nowrap;

    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-right: 0;
    min-height: 100%;
    box-shadow: 1px 0 0 0 var(--el-border-color) inset, 0 1px 0 0 var(--el-border-color) inset, 0 -1px 0 0 var(--el-border-color) inset;
    height: 32px;
    margin-left: 5px;
  }
  .el-select {
    margin: 0;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  .el-select__wrapper {
    box-shadow: none;
    background: none;
    border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  }
}

.select-prefix {
  padding-left: 5px;
  color: var(--el-color-info);
}
</style>
