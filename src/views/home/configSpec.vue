<template>
  <div>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>
      <el-table-column prop="id" label="ID" sortable />
      <el-table-column prop="name" label="Name" sortable />
      <el-table-column prop="type" label="值类型" sortable />
      <el-table-column prop="value" label="值" sortable />
      <el-table-column label="转换规则" >
        <template #default="scope">
          <span >{{formatter(scope.row)}}</span>
          <el-button :icon="CopyDocument" circle @click="CopyToClipboard(scope.row)" style="margin: 5px;"/>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="handleConfigSpecClick(scope.row)">配置规则</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogSpecConfigVisible" title="编辑规则" width="2000" height="800" center draggable overflow>
      <configSpecDetail v-model:node="currentConfigSpecDetail"></configSpecDetail>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogSpecConfigVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDialogSpecConfigOk">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>

import configSpecDetail from './configSpecDetail.vue'
import { JsonTreeModel,SpecModel } from '../../utils/model/jsonModel'
import { TableColumnCtx } from 'element-plus'
import { CopyDocument  } from '@element-plus/icons-vue'

const tableData = ref<JsonTreeModel[]>([])
const dialogSpecConfigVisible = ref(false)
const specConfig = ref<SpecModel|null>()
const currentConfigSpecDetail = ref<JsonTreeModel>({
  id: '0',
  type: '',
  name: '',
  value: undefined,
  spec: undefined,
  code: ''
})

let currentRow:JsonTreeModel;
const props = defineProps({
  data: {
    type: Array<JsonTreeModel>,
    default: () => new Array<JsonTreeModel>()
  }
})

const emit = defineEmits(['update:data','onDataChange'])

onMounted(() => {
  tableData.value = props.data;
})
watch(() => props.data, (newVal: Array<JsonTreeModel>, oldVal: Array<JsonTreeModel>) => {
  tableData.value = props.data;
  // 在这里执行需要的逻辑
  
  emit('onDataChange',tableData.value);
});

const handleConfigSpecClick = (row: JsonTreeModel) => {
  currentRow = row;
  currentConfigSpecDetail.value = structuredClone(toRaw(row));
  dialogSpecConfigVisible.value = true;
};

const handleDialogSpecConfigOk = () => {
  dialogSpecConfigVisible.value = false;
  Object.assign(currentRow, currentConfigSpecDetail.value);
  emit('update:data', tableData.value);
  emit('onDataChange',tableData.value);
};


const formatter = (row: JsonTreeModel) => {
  const str = JSON.stringify(row.spec);
  if(str?.length > 20){
    return str.substring(0,20) + '...'
  }
  return str;
}

const CopyToClipboard = (row: JsonTreeModel) => {
  navigator.clipboard.writeText(JSON.stringify(row.spec));
  ElMessage.success('复制成功');
}
</script>
