<template>
  <div class="input-with-prefix">
    <field-info v-if="fieldCode" :fieldCode="fieldCode"></field-info>
    <el-input :model-value="modelValue" @update:model-value="handleInput" v-bind="$attrs" :style="{ width: width ? width : (modelValue.length < 20 ? 20 : modelValue.length) * 15 + 'px' }">
      <template v-for="(_, slotName) in $slots" #[slotName]>
        <slot :name="slotName"></slot>
      </template>
      <template #prepend v-if="prefix">
        {{ prefix }}
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import FieldInfo from '@/views/home/fieldInfo.vue';
interface Props {
  modelValue?: string;
  prefix?: string;
  width?: string;
  preWidth?: string;
  fieldCode?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'input', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  prefix: '',
  preWidth: '100px',
});

const emit = defineEmits<Emits>();

const handleInput = (value: string) => {
  emit('update:modelValue', value);
  emit('input', value);
};
</script>

<style lang="scss">
.input-with-prefix {
  display: inline-block;
}
</style>
