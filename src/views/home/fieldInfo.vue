<template>
  <!-- <el-popover class="box-item" :content="fieldMeta.fieldDesc" placement="top-start" width="350">
    <template #reference>
      <el-icon @click="fieldInfoDialogVisible = true"><InfoFilled /></el-icon>
    </template>
  </el-popover> -->
  <el-tooltip :content="fieldMeta.fieldDesc" effect="customized">
    <el-icon @click="fieldInfoDialogVisible = true"><InfoFilled /></el-icon>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { InfoFilled } from '@element-plus/icons-vue';
import { CONST_FILED_INFO_ITEMS } from '../../utils/constant';
import { FieldInfo } from '@/utils/model/jsonModel';

/* props */
interface Props {
  fieldCode: string;
}
const props = withDefaults(defineProps<Props>(), {});

const fieldInfoDialogVisible = ref(false);
const fieldMeta = ref<FieldInfo>(
  !CONST_FILED_INFO_ITEMS[props.fieldCode as keyof typeof CONST_FILED_INFO_ITEMS]
    ? CONST_FILED_INFO_ITEMS.UNKONWFIELD
    : CONST_FILED_INFO_ITEMS[props.fieldCode as keyof typeof CONST_FILED_INFO_ITEMS],
);
</script>
<style>
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>
