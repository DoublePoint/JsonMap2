<template>
  <div>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 0px; height: 435px" row-key="id" border highlight-current-row row-class-name="custom-row" default-expand-all>
      <el-table-column prop="id" label="ID" sortable show-overflow-tooltip />
      <el-table-column prop="name" label="Name" sortable show-overflow-tooltip />
      <el-table-column prop="type" label="值类型" sortable show-overflow-tooltip />
      <el-table-column prop="value" label="值" sortable width="100px" show-overflow-tooltip />
      <el-table-column label="转换规则">
        <template #default="scope">
          <el-button :icon="CopyDocument" circle @click="CopyToClipboard(scope.row)" style="margin: 5px" />
          <el-tag v-if="scope.row.spec">规则</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button :type="scope.row.spec ? 'success' : 'primary'" @click="handleConfigSpecClick(scope.row)">规则</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogSpecConfigVisible" title="编辑规则" width="1900" height="600" align-center center draggable overflow transition="dialog-bounce">
      <configSpecDetail v-model:node="currentConfigSpecDetail" :root-node="tableData" @update:node="updateNode"></configSpecDetail>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogSpecConfigVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDialogSpecConfigOk"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import configSpecDetail from './configSpecDetail.vue';
import { JsonTreeModel, SpecModel } from '../../utils/model/jsonModel';
import { inputEmits, TableColumnCtx } from 'element-plus';
import { CopyDocument } from '@element-plus/icons-vue';

const tableData = ref<JsonTreeModel[]>([]);
const dialogSpecConfigVisible = ref(false);
const specConfig = ref<SpecModel | null>();
import { plainToInstance } from 'class-transformer';

const currentConfigSpecDetail = ref<JsonTreeModel>({
  id: '0',
  type: '',
  name: '',
  value: undefined,
  spec: undefined,
  code: '',
});

let currentRow: JsonTreeModel;
const props = defineProps({
  data: {
    type: Array<JsonTreeModel>,
    default: () => new Array<JsonTreeModel>(),
  },
});

const emit = defineEmits(['update:data', 'onDataChange']);

onMounted(() => {
  tableData.value = props.data;
});
watch(
  () => props.data,
  (newVal: Array<JsonTreeModel>, oldVal: Array<JsonTreeModel>) => {
    tableData.value = props.data;
    // 在这里执行需要的逻辑

    emit('onDataChange', tableData.value);
  },
);

const handleConfigSpecClick = (row: JsonTreeModel) => {
  currentRow = row;
  currentConfigSpecDetail.value = plainToInstance(JsonTreeModel, toRaw(row), {
    enableCircularCheck: true, // 如果出现循环引用可加
    exposeDefaultValues: false, // 不填充默认值
  });
  if (!currentConfigSpecDetail.value.spec) {
    currentConfigSpecDetail.value.spec = new SpecModel(row, tableData.value);
  }
  // currentConfigSpecDetail.value = structuredClone<JsonTreeModel>(toRaw(row));
  dialogSpecConfigVisible.value = true;
};

const handleDialogSpecConfigOk = () => {
  dialogSpecConfigVisible.value = false;
  Object.assign(currentRow, currentConfigSpecDetail.value);
  emit('update:data', tableData.value);
  emit('onDataChange', tableData.value);
};

const formatter = (row: JsonTreeModel) => {
  const str = JSON.stringify(row.spec);
  if (str?.length > 20) {
    return str.substring(0, 5) + '...';
  }
  return str;
};

const CopyToClipboard = (row: JsonTreeModel) => {
  navigator.clipboard.writeText(JSON.stringify(row.spec));
  ElMessage.success('复制成功');
};
</script>
<style scoped>
.custom-row {
  height: 48px !important; /* 自定义行高 */
}
</style>
