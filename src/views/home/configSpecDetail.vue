<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="19">
        <!-- #region 节点信息 -->
        <el-card class="ll-card" shadow="always">
          <el-descriptions title="节点信息" border>
            <el-descriptions-item label="Key">{{ innNode.code }}</el-descriptions-item>
            <el-descriptions-item label="值类型">
              <el-tag size="small">{{ innNode.type }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="值">{{ innNode.value }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
        <!-- #endregion 节点信息-->
        <!-- #region 输出条件信息-->
        <el-button type="primary" :icon="Plus" circle @click="handleAddSpec" style="margin: 10px" />
        <!-- endregion 输出条件信息-->
        <el-tabs type="border-card" v-model="tabActiveName">
          <el-tab-pane
            v-for="(specDetail, index) in innSpec!.specList"
            :label="specDetail.title + (index + 1) + (specDetail.whereExpression.whereExpression ? ' : [' + specDetail.whereExpression.whereExpression + ']' : '')"
            :name="index + ''"
          >
            <el-card class="ll-card" shadow="always">
              <el-descriptions title="输出条件配置" border />

              <field-info fieldCode="1"></field-info>
              <el-input v-model="specDetail.whereExpression.whereExpression" style="width: 340px" @input="handleWhereExpressionChange" placeholder="当值为输入内容时输出">
                <template #prepend>输出条件</template>
              </el-input>
              <el-tag v-if="specDetail.whereExpression.whereExpression">当值 = {{ specDetail.whereExpression.whereExpression }} 时输出</el-tag>
            </el-card>

            <el-row :gutter="20">
              <el-col :span="17">
                <!-- #region 输出节点信息配置-->
                <el-card class="ll-card" shadow="always">
                  <el-descriptions title="输出JSON 值配置" border />
                  <SelectWithPrefix
                    v-model="specDetail.keySelectType"
                    fieldCode="OUTPUT_PATH_JSON_KEY_1"
                    @change="handleKeySelectTypeChange(specDetail, $event)"
                    :options="selOptShiftKeyTypeOptions"
                    prefix="节点类型"
                  />

                  <SelectWithPrefix
                    v-model="specDetail.nodeKeyExpressionParam1"
                    :options="levelItems"
                    @change="handleNodeKeyExpressionParam1(specDetail, $event)"
                    prefix="向上几级的节点"
                    v-show="specDetail.keySelectType == Constant.CONST_KEY_SELECT_TYPE.UPPER_NODE"
                  />
                  <InputWithPrefix
                    v-model="specDetail.nodeKeyExpressionParam2"
                    fieldCode="1"
                    @input="handleNodeKeyExpressionParam2(specDetail, $event)"
                    prefix="该节点下的属性"
                    v-show="specDetail.keySelectType == Constant.CONST_KEY_SELECT_TYPE.UPPER_NODE"
                  >
                    <template #prepend>匹配的属性名</template>
                  </InputWithPrefix>

                  <!-- <el-input style="width: 240px" @input="handleNodeKeyExpressionParam2(specDetail, $event)">
                <template #prepend>匹配的属性名</template>
              </el-input> -->
                  <el-input
                    style="width: 240px"
                    v-show="specDetail.keySelectType != Constant.CONST_KEY_SELECT_TYPE.CURRENT_NODE"
                    :disabled="specDetail.keySelectType == Constant.CONST_KEY_SELECT_TYPE.ALL_CURRENT_LEVEL_NODE"
                    v-model="specDetail.nodeKeyExpression"
                    @input="handleInputSelOptShiftKeyRegularInput"
                    placeholder="请输入Key的匹配规则"
                  >
                    <template #prepend>最终规则表达式</template>
                  </el-input>
                </el-card>
                <!-- #endregion 输出节点信息配置-->
              </el-col>
              <el-col :span="7">
                <!-- #region 输出JSON 键Or值配置 -->
                <el-card class="ll-card" shadow="always">
                  <el-descriptions title="输出Key 还是 Value" border />
                  <el-checkbox-group v-model="specDetail.outputKeyOrValueType" :min="1" :max="3" @change="outputKeyOrValueTypeChange(specDetail, $event)">
                    <el-checkbox v-for="item in outputKeyOrValueTypeItems" :key="item.value" :label="item.label" :value="item.value">
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-card>
                <!-- #endregion 输出JSON 键Or值配置-->
              </el-col>
            </el-row>

            <!-- #region 输出JSON 内容配置 -->
            <el-row>
              <el-card class="ll-card" shadow="always">
                <el-descriptions title="输出JSON内容配置" border> </el-descriptions>

                <!-- #region 输出Key的所有配置 -->
                <el-card v-show="specDetail.outputKeyOrValueType.indexOf(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.KEY) != -1" style="margin: 10px">
                  <el-divider content-position="left">输出多个键</el-divider>
                  <el-button type="primary" :icon="Plus" circle @click="handleAddOutputKeyExpression(specDetail)" />
                  <!-- 输出Key的所有配置 -->
                  <el-row v-for="(expression, index) in specDetail.outputKeysExpressions">
                    <!-- #region 当选择的输出是键的时候，需要输入键的表达式 -->
                    <el-button :icon="Delete" circle @click="handleDelOutputKeyExpression(specDetail, index)" style="margin: 5px" />

                    <SelectWithPrefix
                      v-model="expression.outputKeyExpressionParam1"
                      :options="outPutKeyParam1Items"
                      @change="handleNodeKeyExpressionParam1(specDetail, $event)"
                      prefix="向上几级的Key"
                      v-show="specDetail.keySelectType == Constant.CONST_KEY_SELECT_TYPE.UPPER_NODE || specDetail.keySelectType == Constant.CONST_KEY_SELECT_TYPE.EXPRESSION_NODE"
                    />
                    <SelectWithPrefix
                      field-code="OUTPUT_PATH_CONFIG_4_1"
                      v-model="expression.outputKeyExpressionParam2"
                      :options="levelItems"
                      @change="handleNodeKeyExpressionParam1(specDetail, $event)"
                      prefix="匹配的第几段"
                      v-show="specDetail.keySelectType == Constant.CONST_KEY_SELECT_TYPE.UPPER_NODE || specDetail.keySelectType == Constant.CONST_KEY_SELECT_TYPE.EXPRESSION_NODE"
                    />
                    <OutputPathConfig :data="expression" :root-node="rootNode" :current-node="innNode as JsonTreeModel" @on-data-change="handleOutputPathConfigChange"></OutputPathConfig>
                    <!-- #endregion 当选择的输出是键的时候，需要输入键的表达式-->
                  </el-row>
                </el-card>
                <!-- #endregion 输出Key的所有配置 -->

                <!-- #region 输出Value的所有配置 -->
                <el-card v-show="specDetail.outputKeyOrValueType.indexOf(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE) != -1" style="margin: 10px">
                  <el-divider content-position="left">输出值</el-divider>
                  <el-row v-for="(expression, index) in specDetail.outputValuesExpressions">
                    <OutputPathConfig :data="expression" :root-node="rootNode" :current-node="innNode as JsonTreeModel" @on-data-change="handleOutputPathConfigChange"></OutputPathConfig>
                  </el-row>
                </el-card>
                <!-- #endregion 输出Value的所有配置 -->

                <!-- #region 输出特定内容的所有有配置 -->
                <el-card v-show="specDetail.outputKeyOrValueType.indexOf(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE) != -1" style="margin: 10px">
                  <el-divider content-position="left">输出特定内容</el-divider>
                  <el-button type="primary" :icon="Plus" circle @click="handleAddOutputConstValueExpression(specDetail)" />
                  <el-row v-for="(expression, index) in specDetail.outputConstValuesExpressions">
                    <el-input v-model="expression.outputConstValue" placeholder="请输入输出的特定文本" style="width: 200px"></el-input>
                    <OutputPathConfig :data="expression" :root-node="rootNode" :current-node="innNode as JsonTreeModel" @on-data-change="handleOutputPathConfigChange"></OutputPathConfig>
                  </el-row>
                </el-card>
                <!-- #endregion 输出特定内容的所有的所有配置 -->
              </el-card>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="5"><Vue3JsonEditor v-model="outputJson" :show-btns="false" :expandedOnStart="true" mode="code" /> </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { CheckboxValueType } from 'element-plus';
import { SpecModel, JsonTreeModel, SpecDetail, OutputKeyExpression, OutputValueExpression, OutputConstValueExpression, DropBean } from '../../utils/model/jsonModel';
import * as Constant from '@/utils/constant';
import { Delete, Plus } from '@element-plus/icons-vue';
import fieldInfo from './fieldInfo.vue';
import OutputPathConfig from './outputPathConfig.vue';
import { $warning } from '@/utils/message';
import exp from 'constants';
import { buildSpec, replaceSpecialCharacters, updateTreeNode } from '@/utils/jsonUtil';
import joltApi from '@/api/modules/jsonMap';
import { Vue3JsonEditor } from 'vue3-json-editor';
import { useGlobalStore } from '@/store/global';

const globalStore = useGlobalStore();

const emit = defineEmits(['update:node', 'onChange']);
const fieldInfoDialogVisible = ref(false);
/* props */
interface Props {
  // spec?: SpecModel|null,
  node: JsonTreeModel;
  rootNode: JsonTreeModel[];
}
defineExpose({
  transform,
});
const outputJson = ref({});
const props = withDefaults(defineProps<Props>(), {});
const innSpec = computed(() => {
  return props.node.spec;
});
// ✅ 响应式同步
// const innNode = computed(() => {
//   // innSpec.value = props.node.spec;
//   return props.node;
// });
// 1. 用 ref 做一份可变的“内部副本”
const innNode = ref<JsonTreeModel>(props.node);

// 2. 当 props.node 变化时，同步回副本
watch(
  () => props.node,
  (newVal) => {
    innNode.value = newVal; // 允许外部更新覆盖本地
  },
  { immediate: true },
);

//监听innSpec
watch(
  () => innNode.value,
  (newVal, oldVal) => {
    const mergeJson = updateTreeNode(globalStore.specTreeNode, newVal as JsonTreeModel);
    const formatedSpec = buildSpec(mergeJson);
    joltApi
      .transformJson({
        input: JSON.stringify(globalStore.inputJson),
        spec: JSON.stringify(formatedSpec),
      })
      .then((res) => {
        outputJson.value = res;
      });
  },
  { immediate: true, deep: true },
);

const tabActiveName = ref('0');
// select 组件
const selOptShiftKeyTypeOptions = ref(Constant.CONST_KEY_SELECT_TYPE_ITEMS);
const outputKeyOrValueTypeItems = ref(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE_ITEMS);
const levelItems = ref<DropBean[]>([]);
for (let i = 0; i <= 20; i++) {
  levelItems.value.push(new DropBean(i.toString(), i.toString()));
}
const outPutKeyParam1Items = ref<DropBean[]>([]);
for (let i = 0; i <= 20; i++) {
  outPutKeyParam1Items.value.push(new DropBean(i.toString(), `向上${i.toString()}级`));
}

function handleKeySelectTypeChange(specDetail: SpecDetail, value: string) {
  switch (value) {
    case Constant.CONST_KEY_SELECT_TYPE.CURRENT_NODE:
      specDetail.nodeKeyExpression = innNode.value.code;
      specDetail.nodeKeyExpressionParam1 = replaceSpecialCharacters(specDetail.nodeKeyExpressionParam1);
      break;
    case Constant.CONST_KEY_SELECT_TYPE.ALL_CURRENT_LEVEL_NODE:
      specDetail.nodeKeyExpression = '*';
      break;
    case Constant.CONST_KEY_SELECT_TYPE.EXPRESSION_NODE:
      specDetail.nodeKeyExpression = '*';
      break;
    case Constant.CONST_KEY_SELECT_TYPE.UPPER_NODE:
      specDetail.nodeKeyExpression = '@0';
  }
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}

const handleInputSelOptShiftKeyRegularInput = (value: string) => {
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
};
const outputKeyOrValueTypeChange = (specDetail: SpecDetail, checkBoxValue: CheckboxValueType[]) => {
  const value = checkBoxValue.map((v) => v.toString()); // 转为字符串数组使用
  //包含Key
  if (value.indexOf(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.KEY) != -1) {
    if (!specDetail.outputKeysExpressions || specDetail.outputKeysExpressions?.length == 0) {
      specDetail.outputKeysExpressions = [new OutputKeyExpression(innNode.value as JsonTreeModel, props.rootNode, '0')];
    }
  } else {
    specDetail.outputKeysExpressions.splice(0, specDetail.outputKeysExpressions.length);
  }
  //包含Value
  if (value.indexOf(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE) != -1) {
    if (!specDetail.outputValuesExpressions || specDetail.outputValuesExpressions?.length == 0) {
      specDetail.outputValuesExpressions = [new OutputValueExpression(innNode.value as JsonTreeModel, props.rootNode)];
    }
  } else {
    specDetail.outputValuesExpressions.splice(0, specDetail.outputValuesExpressions.length);
  }

  //包含ConstValue
  if (value.indexOf(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE) != -1) {
    if (!specDetail.outputConstValuesExpressions || specDetail.outputConstValuesExpressions?.length == 0) {
      specDetail.outputConstValuesExpressions = [new OutputConstValueExpression(innNode.value as JsonTreeModel, props.rootNode)];
    }
  } else {
    specDetail.outputConstValuesExpressions.splice(0, specDetail.outputConstValuesExpressions.length);
  }

  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
};

const handleNodeKeyExpressionParam1 = (specDetail: SpecDetail, value: string) => {
  // if (!specDetail.nodeKeyExpressionParam2) {
  //   specDetail.nodeKeyExpression = `@(${specDetail.nodeKeyExpressionParam1})`;
  // } else {
  //   specDetail.nodeKeyExpression = `@(${specDetail.nodeKeyExpressionParam1},${specDetail.nodeKeyExpressionParam2})`;
  // }

  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
};
const handleNodeKeyExpressionParam2 = (specDetail: SpecDetail, value: string) => {
  if (!specDetail.nodeKeyExpressionParam2) {
    specDetail.nodeKeyExpression = `@(${specDetail.nodeKeyExpressionParam1})`;
  } else {
    specDetail.nodeKeyExpression = `@(${specDetail.nodeKeyExpressionParam1},${specDetail.nodeKeyExpressionParam2})`;
  }

  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
};
const handleDelOutputKeyExpression = (specDetail: SpecDetail, index: number) => {
  specDetail.outputKeysExpressions.splice(index, 1);
};

const handleAddOutputKeyExpression = (specDetail: SpecDetail) => {
  specDetail.outputKeysExpressions.push(new OutputKeyExpression(innNode.value as JsonTreeModel, props.rootNode, Constant.CONST_OUTPUT_KEY_PARAM1_TYPE.CURRENT_KEY));
};

const handleAddOutputConstValueExpression = (specDetail: SpecDetail) => {
  specDetail.outputConstValuesExpressions.push(new OutputConstValueExpression(innNode.value as JsonTreeModel, props.rootNode));
};

const handleAddSpec = () => {
  if (!innSpec.value!.specList[parseInt(tabActiveName.value)].whereExpression.whereExpression) {
    $warning('如果您未输入<span style="color:teal;font-weight:bold;">输出条件配置</span>时，完全可以在当前Tab页面配置输出条件。');
    return;
  }

  innSpec.value!.specList.push(new SpecDetail(innNode.value as JsonTreeModel, props.rootNode));
  innNode.value.spec = innSpec.value;
  tabActiveName.value = (innSpec.value!.specList.length - 1).toString();
  emit('update:node', innNode.value);
};
const handleWhereExpressionChange = (value: string) => {
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
};
function transform(inputJson: string, formatedSpec: string) {
  joltApi
    .transformJson({
      input: JSON.stringify(inputJson),
      spec: JSON.stringify(formatedSpec),
    })
    .then((res) => {
      outputJson.value = res;
    });
}
const handleOutputPathConfigChange = (value: string) => {
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
};
</script>
<style>
.ll-card {
  width: 100%;
  margin: 0px;
}
.el-row {
  margin-top: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.el-select,
.el-input {
  margin: 5px;
}
</style>
