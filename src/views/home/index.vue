<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-header class="ll-header">
        <el-row :gutter="20" class="ll-row">
          <el-col :span="20"> </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </el-header> -->
      <el-main class="ll-main">
        <!-- <el-select v-model="activeDemoId" @change="handleActiveDemoChange" style="width: 240px">
          <el-option v-for="item in innAllDemo" :key="item.id" :label="item.name" :value="item.id" />
        </el-select> -->
        <el-splitter>
          <el-splitter-panel size="20%">
            <div class="demo-panel">
              <Vue3JsonEditor class="ll-json-editor" v-model="inputJson" :show-btns="false" :expandedOnStart="true" @json-change="onInputJsonChange" mode="code" />
            </div>
          </el-splitter-panel>
          <el-splitter-panel size="40%">
            <div class="demo-panel">
              <el-button type="primary" @click="copyTree">复制整个树</el-button>
              <configSpec v-model:data="treeJson" @onDataChange="handleTreeChange"></configSpec>
            </div>
          </el-splitter-panel>
          <el-splitter-panel size="20%">
            <div class="demo-panel">
              <Vue3JsonEditor v-model="formatedSpec" :show-btns="false" :expandedOnStart="true" mode="code" />
            </div>
          </el-splitter-panel>
          <el-splitter-panel size="20%">
            <div class="demo-panel">
              <Vue3JsonEditor v-model="outputJson" :show-btns="false" :expandedOnStart="true" mode="code" />
            </div>
          </el-splitter-panel>
        </el-splitter>
      </el-main>
      <el-footer>
        <ul>
          <li v-for="(item, index) in innAllDemo">
            <el-link type="primary" @click="handleDemoClick(item)" :underline="item.id == activeDemoId" style="color: '#337ab7'">{{ index + 1 + ': ' + item.name }}</el-link>
          </li>
        </ul>
      </el-footer>
    </el-container>
  </div>
</template>
<script setup lang="ts">
// import { defineComponent, reactive, toRefs } from 'vue'
import { Vue3JsonEditor } from 'vue3-json-editor';
import configSpec from './configSpec.vue';
import { jsonToTree, treeToSpecJson, buildSpec, mergeJsonWithSpec } from '../../utils/jsonUtil';
import { JsonTreeModel } from '../../utils/model/jsonModel';
import joltApi from '@/api/modules/jsonMap';
import * as JSONDATA from '@/assets/data/data';
import { ALL_DEMO, DemoItem } from '@/assets/data/data';

const inputJson = ref({});
const outputJson = ref({});
const treeJson = ref<JsonTreeModel[]>([]);
const formatedSpec = ref([]);
const innAllDemo = ref(ALL_DEMO);
const activeDemoId = ref('');

onMounted(() => {
  init();
  inputToTreeAndTransform();
});

function init() {
  activeDemoId.value = '1';
  handleActiveDemoChange();
}
function onInputJsonChange(value: any) {
  inputJson.value = value;
  inputToTreeAndTransform();
}

/**
 * inputJson 转换成树形结构，并转换成目标json
 */
function inputToTreeAndTransform() {
  inputToTree();
  transform();
}

function inputToTree() {
  const treeData = jsonToTree(inputJson.value);
  treeJson.value = mergeJsonWithSpec(JSON.stringify(treeData), JSON.stringify(treeJson.value));
}

const handleTreeChange = (value: any) => {
  formatedSpec.value = buildSpec(value);
  transform();
};

const copyTree = () => {
  navigator.clipboard.writeText(JSON.stringify(treeJson.value));
  ElMessage.success('复制成功');
};

function transform() {
  joltApi
    .transformJson({
      input: JSON.stringify(inputJson.value),
      spec: JSON.stringify(formatedSpec.value),
    })
    .then((res) => {
      outputJson.value = res;
    });
}
const handleActiveDemoChange = () => {
  inputJson.value = innAllDemo.value.filter((item) => item.id === activeDemoId.value)[0].data.input;
  treeJson.value = innAllDemo.value.filter((item) => item.id === activeDemoId.value)[0].data.spec;
};
const handleDemoClick = (demoDetail: DemoItem) => {
  activeDemoId.value = demoDetail.id;
  handleActiveDemoChange();
};
</script>
<style scoped></style>
<style>
.ace-jsoneditor,
.jsoneditor-outer {
  min-height: 800px !important;
}
.demo-panel {
  padding: 0 5px;
}
</style>
