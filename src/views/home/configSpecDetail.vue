$(
<template>
  <div>
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
    {{ innSpec?.specList?.length }}
    <el-tabs editable type="border-card" v-model="tabActiveName">
      <el-tab-pane v-for="(specDetail, index) in innSpec.specList" :label="specDetail.title + (index + 1) + ' : [' + (specDetail.whereExpression.whereExpression || '') + ']'" :name="index + ''">
        <el-card class="ll-card" shadow="always">
          <el-descriptions title="输出条件配置" border /> 
          <field-info fieldCode="1"></field-info>
          <el-input v-model="specDetail.whereExpression.whereExpression" style="width: 240px" @input="handleWhereExpressionChange" placeholder="当值为输入内容时输出"></el-input>
          <el-tag v-if="specDetail.whereExpression.whereExpression">当值 = {{ specDetail.whereExpression.whereExpression }} 时输出</el-tag>
        </el-card>

        <el-row :gutter="20">
          <el-col :span="12">
            <!-- #region 输出节点信息配置-->
            <el-card class="ll-card" shadow="always">
              <el-descriptions title="输出JSON 值配置" border />
              <el-select v-model="specDetail.keySelectType" @change="handleKeySelectTypeChange(specDetail, $event)" style="width: 240px">
                <el-option v-for="item in selOptShiftKeyTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>

              <el-select
                style="width: 100px; margin-left: 20px"
                v-model="specDetail.nodeKeyExpressionParam1"
                @change="handleNodeKeyExpressionParam1(specDetail, $event)"
                placeholder="向上几级的Key"
                v-show="specDetail.keySelectType == Constant.CONST_KEY_SELECT_TYPE.UPPER_NODE"
              >
                <el-option v-for="item in levelItems" :label="'向上' + item.label + '级'" :value="item.value"></el-option>
              </el-select>
              <el-input
                style="width: 240px"
                v-show="specDetail.keySelectType == Constant.CONST_KEY_SELECT_TYPE.UPPER_NODE"
                v-model="specDetail.nodeKeyExpressionParam2"
                @input="handleNodeKeyExpressionParam2(specDetail, $event)"
                placeholder="匹配的属性名"
              />
              <el-input
                style="width: 240px"
                v-show="specDetail.keySelectType != Constant.CONST_KEY_SELECT_TYPE.CURRENT_NODE"
                :disabled="specDetail.keySelectType == Constant.CONST_KEY_SELECT_TYPE.ALL_CURRENT_LEVEL_NODE"
                v-model="specDetail.nodeKeyExpression"
                @input="handleInputSelOptShiftKeyRegularInput"
                placeholder="请输入Key的匹配规则"
              />
            </el-card>
            <!-- #endregion 输出节点信息配置-->
          </el-col>
          <el-col :span="12">
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

                <el-select style="width: 150px" v-model="expression.outputKeyExpressionParam1" placeholder="向上几级的Key">
                  <el-option v-for="item in outPutKeyParam1Items" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select
                  style="width: 150px; margin-left: 20px"
                  v-model="expression.outputKeyExpressionParam2"
                  placeholder="匹配的第几段"
                  :disabled="expression.outputKeyExpressionParam1 == Constant.CONST_OUTPUT_KEY_PARAM1_TYPE.CURRENT_KEY"
                >
                  <el-option v-for="item in levelItems" :label="'匹配第' + item.label + '段'" :value="item.value"></el-option>
                </el-select>
                <el-tag style="margin: 5px; line-height: 24px">{{
                  `$(` + expression.outputKeyExpressionParam1 + (expression.outputKeyExpressionParam2 ? ',' + expression.outputKeyExpressionParam2 : '') + ')'
                }}</el-tag>
                <span>{{ expression.outputKeyExpression }}</span>
                <OutputPathConfig :data="expression" :root-node="rootNode" :current-node="innNode" @on-data-change="handleOutputPathConfigChange"></OutputPathConfig>
                <!-- #endregion 当选择的输出是键的时候，需要输入键的表达式-->
              </el-row>
            </el-card>
            <!-- #endregion 输出Key的所有配置 -->

            <!-- #region 输出Value的所有配置 -->
            <el-card v-show="specDetail.outputKeyOrValueType.indexOf(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE) != -1" style="margin: 10px">
              <el-divider content-position="left">输出值</el-divider>
              <el-row v-for="(expression, index) in specDetail.outputValuesExpressions">
                <OutputPathConfig :data="expression" :root-node="rootNode" :current-node="innNode" @on-data-change="handleOutputPathConfigChange"></OutputPathConfig>
              </el-row>
            </el-card>
            <!-- #endregion 输出Value的所有配置 -->

            <!-- #region 输出特定内容的所有有配置 -->
            <el-card v-show="specDetail.outputKeyOrValueType.indexOf(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE) != -1" style="margin: 10px">
              <el-divider content-position="left">输出特定内容</el-divider>
              <el-button type="primary" :icon="Plus" circle @click="handleAddOutputConstValueExpression(specDetail)" />
              <el-row v-for="(expression, index) in specDetail.outputConstValuesExpressions">
                <el-input v-model="expression.outputConstValue" placeholder="请输入输出的特定文本" style="width: 200px"></el-input>
                <OutputPathConfig :data="expression" :root-node="rootNode" :current-node="innNode" @on-data-change="handleOutputPathConfigChange"></OutputPathConfig>
                <!-- #endregion 当选择的输出是键的时候，需要输入键的表达式-->
              </el-row>
            </el-card>
            <!-- #endregion 输出特定内容的所有的所有配置 -->
          </el-card>
          <!-- #endregion 输出JSON 键配置 -->
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { CheckboxValueType } from 'element-plus';
import { SpecModel, JsonTreeModel, SpecDetail, OutputKeyExpression, OutputValueExpression, OutputConstValueExpression } from '../../utils/model/jsonModel';
import { IDropBean } from '../../utils/model/jsonModelInterface';
import * as Constant from '@/utils/constant';
import { Delete, Plus } from '@element-plus/icons-vue';
import fieldInfo from './fieldInfo.vue';
import OutputPathConfig from './outputPathConfig.vue';
import { $warning } from '@/utils/message';
import exp from 'constants';
import { replaceSpecialCharacters } from '@/utils/jsonUtil';

const emit = defineEmits(['update:node']);
const fieldInfoDialogVisible = ref(false);
/* props */
interface Props {
  // spec?: SpecModel|null,
  node: JsonTreeModel;
  rootNode: JsonTreeModel[];
}

const props = withDefaults(defineProps<Props>(), {});
const innSpec = computed(() => {
  return props.node.spec;
});
// ✅ 响应式同步
const innNode = computed(() => {
  // innSpec.value = props.node.spec;
  return props.node;
});

const tabActiveName = ref('0');
// select 组件
const selOptShiftKeyTypeOptions = ref(Constant.CONST_KEY_SELECT_TYPE_ITEMS);
const outputKeyOrValueTypeItems = ref<IDropBean[]>(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE_ITEMS);
const levelItems = ref<IDropBean[]>([]);
for (let i = 0; i <= 20; i++) {
  levelItems.value.push({ value: i.toString(), label: i.toString() });
}
const outPutKeyParam1Items = ref<IDropBean[]>([
  {
    value: Constant.CONST_OUTPUT_KEY_PARAM1_TYPE.CURRENT_KEY,
    label: '当前KEY',
  },
]);
for (let i = 0; i <= 20; i++) {
  outPutKeyParam1Items.value.push({ value: i.toString(), label: `向上${i.toString()}级` });
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
      specDetail.outputKeysExpressions = [new OutputKeyExpression(innNode.value, props.rootNode, '0')];
    }
  } else {
    specDetail.outputKeysExpressions.splice(0, specDetail.outputKeysExpressions.length);
  }
  //包含Value
  if (value.indexOf(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE) != -1) {
    if (!specDetail.outputValuesExpressions || specDetail.outputValuesExpressions?.length == 0) {
      specDetail.outputValuesExpressions = [new OutputValueExpression(innNode.value, props.rootNode)];
    }
  } else {
    specDetail.outputValuesExpressions.splice(0, specDetail.outputValuesExpressions.length);
  }

  //包含ConstValue
  if (value.indexOf(Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE) != -1) {
    if (!specDetail.outputConstValuesExpressions || specDetail.outputConstValuesExpressions?.length == 0) {
      specDetail.outputConstValuesExpressions = [new OutputConstValueExpression(innNode.value, props.rootNode)];
    }
  } else {
    specDetail.outputConstValuesExpressions.splice(0, specDetail.outputConstValuesExpressions.length);
  }

  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
};

const handleNodeKeyExpressionParam1 = (specDetail: SpecDetail, value: string) => {
  if (!specDetail.nodeKeyExpressionParam2) {
    specDetail.nodeKeyExpression = `@(${specDetail.nodeKeyExpressionParam1})`;
  } else {
    specDetail.nodeKeyExpression = `@(${specDetail.nodeKeyExpressionParam1},${specDetail.nodeKeyExpressionParam2})`;
  }

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
  specDetail.outputKeysExpressions.push(new OutputKeyExpression(innNode.value, props.rootNode, Constant.CONST_OUTPUT_KEY_PARAM1_TYPE.CURRENT_KEY));
};

const handleAddOutputConstValueExpression = (specDetail: SpecDetail) => {
  specDetail.outputConstValuesExpressions.push(new OutputConstValueExpression(innNode.value, props.rootNode));
};

const handleAddSpec = () => {
  if (!innSpec.value.specList[parseInt(tabActiveName.value)].whereExpression.whereExpression) {
    $warning('如果您未输入<span style="color:teal;font-weight:bold;">输出条件配置</span>时，完全可以在当前Tab页面配置输出条件。');
    return;
  }

  innSpec.value.specList.push(new SpecDetail(innNode.value, props.rootNode));
  innNode.value.spec = innSpec.value;
  tabActiveName.value = (innSpec.value.specList.length - 1).toString();
  emit('update:node', innNode.value);
};
const handleWhereExpressionChange = (value: string) => {
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
};

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
