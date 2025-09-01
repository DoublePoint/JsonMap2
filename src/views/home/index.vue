<template>
  <div class="common-layout">
    <el-container>
      <el-header class="ll-header">
        <el-row :gutter="20" class="ll-row">
          <el-col :span="20"> <h1 class="page-title">JSON Weaver</h1> </el-col>
          <el-col :span="4"
            ><div class="header-right">
              <a href="https://github.com/your-username/JsonMap2" target="_blank" class="github-link" title="查看 GitHub 仓库">
                <el-icon :size="20" class="github-icon">
                  <svg t="1756723113695" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1609" width="200" height="200">
                    <path
                      d="M498.894518 100.608396c-211.824383 0-409.482115 189.041494-409.482115 422.192601 0 186.567139 127.312594 344.783581 295.065226 400.602887 21.13025 3.916193 32.039717-9.17701 32.039717-20.307512 0-10.101055 1.176802-43.343157 1.019213-78.596056-117.448946 25.564235-141.394311-49.835012-141.394311-49.835012-19.225877-48.805566-46.503127-61.793368-46.503127-61.793368-38.293141-26.233478 3.13848-25.611308 3.13848-25.611308 42.361807 2.933819 64.779376 43.443441 64.779376 43.443441 37.669948 64.574714 98.842169 45.865607 122.912377 35.094286 3.815909-27.262924 14.764262-45.918819 26.823925-56.431244-93.796246-10.665921-192.323237-46.90017-192.323237-208.673623 0-46.071292 16.498766-83.747379 43.449581-113.332185-4.379751-10.665921-18.805298-53.544497 4.076852-111.732757 0 0 35.46063-11.336186 116.16265 43.296085 33.653471-9.330506 69.783343-14.022365 105.654318-14.174837 35.869952 0.153496 72.046896 4.844332 105.753579 14.174837 80.606853-54.631248 116.00813-43.296085 116.00813-43.296085 22.935362 58.18826 8.559956 101.120049 4.180206 111.732757 27.052123 29.584806 43.443441 67.260893 43.443441 113.332185 0 162.137751-98.798167 197.850114-192.799074 208.262254 15.151072 13.088086 28.65155 38.804794 28.65155 78.17957 0 56.484456-0.459464 101.94381-0.459464 115.854635 0 11.235902 7.573489 24.381293 29.014824 20.2543C825.753867 867.330798 933.822165 709.10924 933.822165 522.700713c0-233.155201-224.12657-422.192601-434.927647-422.192601L498.894518 100.608396z"
                      :fill="isDarkTheme ? '#ffffff' : '#3F3F3F'"
                      p-id="1610"
                    ></path>
                  </svg>
                </el-icon>
              </a>
              <el-switch v-model="isDarkTheme" inline-prompt @change="toggleTheme" class="theme-switch">
                <template #active-action>
                  <el-icon :size="12" color="#ffd700"><Moon /></el-icon>
                </template>
                <template #inactive-action>
                  <el-icon :size="12" color="#ff8c00"><Sunny /></el-icon>
                </template>
              </el-switch></div
          ></el-col>
        </el-row>
      </el-header>
      <el-main class="ll-main">
        <el-splitter>
          <el-splitter-panel size="20%" collapsible>
            <div class="panel-header">输入 JSON</div>

            <div class="demo-panel">
              <Vue3JsonEditor class="ll-json-editor" v-model="inputJson" :show-btns="false" :expandedOnStart="true" @json-change="onInputJsonChange" mode="code" />
            </div>
          </el-splitter-panel>
          <el-splitter-panel size="40%" collapsible
            ><div class="panel-header">
              <span>配置规范</span>
              <!-- <el-button type="primary" @click="copyTree" size="small">复制树结构</el-button> -->
              <el-button type="primary" @click="dialogShowSpec = true" size="small">查看规则表达式</el-button>
            </div>
            <div class="demo-panel">
              <configSpec v-model:data="treeJson" @onDataChange="handleTreeChange"></configSpec>
            </div>
          </el-splitter-panel>
          <!-- <el-splitter-panel size="20%"
            >
          </el-splitter-panel> -->
          <el-splitter-panel size="20%" collapsible
            ><div class="panel-header">结果 JSON</div>

            <div class="demo-panel">
              <Vue3JsonEditor v-model="outputJson" :show-btns="false" :expandedOnStart="true" mode="code" />
            </div>
          </el-splitter-panel>
        </el-splitter>
      </el-main>
      <el-footer>
        <el-card style="width: 500px">
          <el-descriptions title="示例" border />
          <ul>
            <li v-for="(item, index) in innAllDemo">
              <el-link type="primary" @click="handleDemoClick(item)" :underline="item.id == activeDemoId" style="color: '#337ab7'">{{ index + 1 + ': ' + item.name }}</el-link>
            </li>
          </ul>
        </el-card>
      </el-footer>
    </el-container>
  </div>
  <el-drawer v-model="dialogShowSpec" title="规则表达式" :direction="'rtl'">
    <Vue3JsonEditor v-model="formatedSpec" :show-btns="false" style="height: 100%" :expandedOnStart="true" mode="code" />
  </el-drawer>
</template>
<script setup lang="ts">
// import { defineComponent, reactive, toRefs } from 'vue'
import { Vue3JsonEditor } from 'vue3-json-editor';
import configSpec from './configSpec.vue';
import { jsonToTree, treeToSpecJson, buildSpec, mergeJsonWithSpec } from '../../utils/jsonUtil';
import { JsonTreeModel } from '../../utils/model/jsonModel';
import { Moon, Sunny, Link } from '@element-plus/icons-vue';

import joltApi from '@/api/modules/jsonMap';
import { ALL_DEMO, DemoItem } from '@/assets/data/data';
import { parse, stringify } from 'flatted';
import { plainToInstance } from 'class-transformer';

const inputJson = ref({});
const outputJson = ref({});
const treeJson = ref<JsonTreeModel[]>([]);
const formatedSpec = ref([]);
const innAllDemo = ref(ALL_DEMO);
const activeDemoId = ref('');
const dialogShowSpec = ref(false);
// 添加主题状态
const isDarkTheme = ref(false);

onMounted(() => {
  init();
  inputToTreeAndTransform();

  // 检查本地存储的主题设置
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark';
    applyTheme(savedTheme === 'dark');
  }
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
  navigator.clipboard.writeText(stringify(treeJson.value));
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
  inputJson.value = innAllDemo.value.filter((item) => item.id === activeDemoId.value)[0].data!.input;
  const json = parse(JSON.stringify(innAllDemo.value.filter((item) => item.id === activeDemoId.value)[0].data!.spec));
  treeJson.value = plainToInstance(JsonTreeModel, json, {
    enableCircularCheck: true, // 如果出现循环引用可加
    exposeDefaultValues: false, // 不填充默认值
  });
  // treeJson.value = parse(JSON.stringify(innAllDemo.value.filter((item) => item.id === activeDemoId.value)[0].data!.spec));
  console.log(treeJson.value);
};
const handleDemoClick = (demoDetail: DemoItem) => {
  activeDemoId.value = demoDetail.id;
  handleActiveDemoChange();
};
const toggleTheme = () => {
  // 设置下一个主题
  // nextThemeIsDark.value = isDarkTheme.value;

  // 保存主题设置到本地存储
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');

  // 在下一帧应用主题
  requestAnimationFrame(() => {
    applyTheme(isDarkTheme.value);
  });
};

// 应用主题
const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
};
</script>
<style scoped>
/* 右侧头部区域 */
.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  gap: 15px;
}

.github-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.github-icon {
  color: var(--el-text-color-secondary);
  transition: color 0.3s;
}

.github-icon:hover {
  color: #177ddc; /* Element Plus 默认主色 */
}
/* 页面标题样式 */
.page-title {
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 60px;
}
/* 面板标题样式 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--el-fill-color-light);
  font-weight: 600;
  color: var(--el-text-color-primary);
  font-size: 14px;
  height: 37px;
}
.theme-transition-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  background: #ffffff;
  mask: radial-gradient(circle at 0% 100%, transparent 0%, transparent 0%, black 0%);
  mask-size: 0% 0%;
  mask-repeat: no-repeat;
  mask-position: 0% 100%;
  animation: themeTransition 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.theme-transition-mask.dark {
  background: #141414;
}

@keyframes themeTransition {
  0% {
    mask-size: 0% 0%;
  }
  100% {
    mask-size: 280% 280%;
  }
}

/* 深色主题样式 */
.dark {
  --el-bg-color: #141414;
  --el-fill-color-blank: #1d1e1f;
  --el-text-color-primary: #ffffff;
  --el-text-color-regular: #e5eaf3;
  --el-border-color: #4c4d4f;
}

/* 浅色主题样式 */
.light {
  --el-bg-color: #ffffff;
  --el-fill-color-blank: #ffffff;
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-border-color: #dcdfe6;
}

.theme-switch {
  --el-switch-on-color: #3a3a3a;
  --el-switch-off-color: #f0f0f0;
  --el-switch-border-color: #dcdfe6;
  border-radius: 12px;
  height: 24px;
  min-width: 80px;
  float: right;
}

.theme-switch :deep(.el-switch__core) {
  border-radius: 12px;
  height: 24px;
  border: 1px solid var(--el-switch-border-color);
}

.theme-switch :deep(.el-switch__inner) {
  font-size: 12px;
  color: #303133 !important; /* 使用 !important 强制覆盖 */
}

.theme-switch :deep(.el-switch__inner .is-active) {
  color: #ffffff !important; /* 激活状态下的文字颜色 */
}

.theme-switch :deep(.el-switch__action) {
  width: 18px;
  height: 18px;
}

/* 深色主题下的开关样式 */
.dark .theme-switch {
  --el-switch-on-color: #1a1a1a;
  --el-switch-off-color: #e0e0e0;
  --el-switch-border-color: #4c4d4f;
}
.dark .theme-switch :deep(.el-switch__inner) {
  color: #e5eaf3 !important; /* 深色主题下的文字颜色 */
}
</style>
<style>
/* JSON编辑器深色主题适配 */
.dark .ace-jsoneditor {
  background-color: #1d1e1f;
}

.dark .ace-jsoneditor .ace_gutter {
  background: #2d2d2d;
  color: #aaa;
}

.dark .ace-jsoneditor .ace_scroller {
  background-color: #1d1e1f;
}

.dark .jsoneditor-menu {
  background-color: #333;
  border-bottom: 1px solid #4c4d4f;
}

.dark .jsoneditor {
  background-color: #1d1e1f;
  border: 1px solid #4c4d4f;
}

.dark .jsoneditor-tree {
  background-color: #1d1e1f;
  color: #e5eaf3;
}

.dark .jsoneditor-field,
.dark .jsoneditor-value {
  color: #e5eaf3;
}

/* 添加这些额外的深色主题样式 */
.dark .jsoneditor-field {
  color: #ff9800;
}

.dark .jsoneditor-field[contenteditable='true']:focus {
  color: #ff9800;
}

.dark .jsoneditor-value {
  color: #4caf50;
}

.dark .jsoneditor-value-null {
  color: #9e9e9e;
}

.dark .jsoneditor-value-undefined {
  color: #9e9e9e;
}

.dark .jsoneditor-value-string {
  color: #03a9f4;
}

.dark .jsoneditor-value-number {
  color: #4caf50;
}

.dark .jsoneditor-value-boolean {
  color: #ff5722;
}

.dark .jsoneditor-selected,
.dark .jsoneditor-connected {
  background-color: #3f3f3f;
  border-color: #555555;
}
/* JSON编辑器深色主题适配 - 变量名(key)样式 */
.dark .ace-jsoneditor .ace_variable {
  color: #ff9800; /* 橙色，使key在深色背景下更清晰可见 */
}

/* 如果还需要调整其他相关样式 */
.dark .ace-jsoneditor .ace_support.ace_type {
  color: #e0e0e0;
}

.dark .ace-jsoneditor .ace_constant.ace_language {
  color: #9e9e9e;
}
/* 深色主题下JSON编辑器选中行高亮 */
.dark .ace-jsoneditor .ace_marker-layer .ace_active-line {
  background-color: #3a3a3a !important;
}

.dark .ace-jsoneditor .ace_gutter-active-line {
  background-color: #3a3a3a !important;
}

/* 选中文本的背景色 */
.dark .ace-jsoneditor .ace_selection {
  background-color: #4a4a4a !important;
}

/* 光标颜色 */
.dark .ace-jsoneditor .ace_cursor {
  color: #ffffff !important;
}
.dark .el-switch.is-checked .el-switch__core .el-switch__action {
  background-color: black;
}

.demo-panel {
  height: calc(100% - 37px);
}

/* 深色主题下的分割面板样式 */
.dark .el-splitter-panel {
  background-color: #1d1e1f;
}
.ace-jsoneditor,
.jsoneditor-outer {
  min-height: 400px !important;
}
</style>

<style>
/* JSON编辑器浅色主题适配 */
.light .ace-jsoneditor {
  background-color: #ffffff;
}

.light .ace-jsoneditor .ace_gutter {
  background: #f5f5f5;
  color: #666;
}

.light .ace-jsoneditor .ace_scroller {
  background-color: #ffffff;
}

.light .jsoneditor-menu {
  border-bottom: 1px solid #e0e0e0;
}

.light .jsoneditor {
  background-color: #ffffff;
  /* border: 1px solid #e0e0e0; */
}

.light .jsoneditor-tree {
  background-color: #ffffff;
  color: #333;
}

.light .jsoneditor-field,
.light .jsoneditor-value {
  color: #333;
}
.light .panel-header {
  background-color: #3883fa;
  color: #ffffff;
}
.jsoneditor-vue {
  height: 100%;
}
.el-splitter-bar {
  margin: 0 5px !important;
}
.light .demo-panel {
  border: 0px solid #3883fa;
}
div.jsoneditor {
  border: 0px solid #3883fa !important;
}
.el-splitter-panel {
  box-shadow: var(--el-box-shadow-light);
}
</style>
