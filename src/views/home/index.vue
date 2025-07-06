<template>
  <div class="common-layout">
    <el-container>
      <el-container>
        <!-- <el-aside width="50%"> -->

        <!-- </el-aside> -->
        <el-main class="ll-main">
          <el-row :gutter="20" class="ll-row">
            <el-col :span="8">
              <Vue3JsonEditor class="ll-json-editor" v-model="json" :show-btns="false" :expandedOnStart="true"
                @json-change="onJsonChange" @mode-change="onModeChange" />
            </el-col>
            <el-col :span="8">
              <configJson :data="formatedJson"></configJson>
            </el-col>
            <el-col :span="8">
              <Vue3JsonEditor v-model="json" :show-btns="false" :expandedOnStart="true" @json-change="onJsonChange"
                @mode-change="onModeChange" />
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
// import { defineComponent, reactive, toRefs } from 'vue'
import { Vue3JsonEditor } from 'vue3-json-editor'
import configJson from './configJson.vue'
import jsonToTree from '../../utils/jsonUtil'

const json = ref({});
const formatedJson = ref([])

function onJsonChange(value) {
  const treeData = jsonToTree(value)
  // console.log(treeData);
  formatedJson.value = treeData
  // console.log('value:', value)
}

function onModeChange(value) {
  console.log('value:', value)
}
json.value = {}
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
