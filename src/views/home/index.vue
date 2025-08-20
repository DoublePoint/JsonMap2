<template>
  <div class="common-layout">
    <el-container>
      <el-container>
        <!-- <el-aside width="50%"> -->

        <!-- </el-aside> -->
        <el-main class="ll-main">
          <el-row :gutter="20" class="ll-row">
            <el-col :span="4">
              <Vue3JsonEditor class="ll-json-editor" v-model="inputJson" :show-btns="false" :expandedOnStart="true"
                @json-change="onInputJsonChange"  mode="code" style="min-height: 800px;" min-height="800px"/>
            </el-col>
            <el-col :span="12">
              <configSpec v-model:data="treeJson" @onDataChange="handleTreeChange"></configSpec>
            </el-col>
            <el-col :span="4">
              <Vue3JsonEditor v-model="formatedSpec" :show-btns="false" :expandedOnStart="true"  mode="code" />
            </el-col>
            <el-col :span="4">
              <Vue3JsonEditor v-model="outputJson" :show-btns="false" :expandedOnStart="true" mode="code" />
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
  
</template>
<script setup lang="ts" >
// import { defineComponent, reactive, toRefs } from 'vue'
import { Vue3JsonEditor } from 'vue3-json-editor'
import configSpec from './configSpec.vue'
import {jsonToTree,treeToSpecJson,buildSpec,mergeJsonWithSpec} from '../../utils/jsonUtil'
import { JsonTreeModel } from '../../utils/model/jsonModel'
import joltApi from '@/api/modules/jsonMap';
import * as JSONDATA from '@/assets/data/data'

const inputJson = ref({});
const outputJson = ref({});
const treeJson = ref<JsonTreeModel[]>([])
const formatedSpec = ref([])

onMounted(() => {
  init();
  inputToTreeAndTransform();
});

function init(){
  inputJson.value= JSONDATA.JSON_TREE;
}
function onInputJsonChange(value:any) {
  inputJson.value = value;
  inputToTreeAndTransform();
}

/**
 * inputJson 转换成树形结构，并转换成目标json
 */
function inputToTreeAndTransform(){
  inputToTree();
  transform();
}

function inputToTree(){
  const treeData = jsonToTree(inputJson.value)
  treeJson.value = mergeJsonWithSpec(JSON.stringify(treeData),JSON.stringify(treeJson.value))
}

const handleTreeChange = (value: any) => {
  formatedSpec.value = buildSpec(value)
  transform();
}

function transform(){
  joltApi.transformJson({
      input:JSON.stringify(inputJson.value),
      spec:JSON.stringify(formatedSpec.value)
    }).then(res=>{
    outputJson.value = res;
  });
}
// inputJson.value = {}
</script>
<style scoped>
.ll-main {
  height: 100%;
}

.ll-row {
  height: 100%;
}

.ll-json-editor {
  height: 100%;
}
</style>
<style>
  .jsoneditor-vue,.jsoneditor {
    min-height: 800px
  }
  .ace-jsoneditor,.jsoneditor-outer {
     min-height: 800px!important;
  }
</style>