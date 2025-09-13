<template>
  <SelectWithPrefix v-model="innExpression.outputPathType" :options="outputPathTypeItems" prefix="目标路径类型" fieldCode="OUTPUT_PATH_CONFIG_1" />

  <!-- 当把KEY作为目标输出路径 -->
  <span v-show="innExpression.outputPathType == CONST_OUTPUT_PATH_TYPE.BY_KEY">
    <InputWithPrefix v-model="innExpression.outputPathExpressionPre" fieldCode="OUTPUT_PATH_CONFIG_2" @input="outputPathExpressionParamArrChange" prefix="前缀" />

    <SelectWithPrefix
      fieldCode="OUTPUT_PATH_CONFIG_BY_KEY_1"
      v-model="innExpression.outputPathExpressionArrayParam1"
      @change="outputPathExpressionParamArrChange"
      prefix="索引位置"
      v-if="innExpression.isPreArr()"
    >
      <el-option v-for="(item, index) in getArrParam1Items" :value="index" :disabled="item.disabled">
        <span style="float: left">{{ '向上' + index + '级' }}</span>
        <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
          {{ item.label }}
        </span>
      </el-option>
    </SelectWithPrefix>

    <SelectWithPrefix v-model="innExpression.outputPathExpressionParam1" fieldCode="OUTPUT_PATH_CONFIG_3" @change="outputPathExpressionParamArrChange" :options="getParam1Items" prefix="向上几级的Key">
      <el-option v-for="(item, index) in getOutputPathExpressionParam1Items" :label="'向上' + index + '级'" :value="index">
        <span v-if="index != 0" style="float: left">{{ '向上' + index + '级' }}</span>
        <span v-else style="float: left">{{ '当前节点' }}</span>
        <span v-if="index != 0" style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
          {{ item.name }}
        </span>
      </el-option>
    </SelectWithPrefix>

    <SelectWithPrefix v-model="innExpression.outputPathExpressionParam2" @change="outputPathExpressionParamArrChange" :options="levelItems" prefix="匹配的第几段" fieldCode="OUTPUT_PATH_CONFIG_4_1">
    </SelectWithPrefix>

    <!-- <el-checkbox v-model="innExpression.outputPathIsContainUpperNode">包含上级节点</el-checkbox> -->
    <InputWithPrefix v-model="innExpression.outputPathExpressionSuf" fieldCode="OUTPUT_PATH_CONFIG_5" @input="outputPathExpressionParamArrChange" prefix="后缀" />
  </span>

  <!-- 当把属性作为目标输出路径 -->
  <div v-show="innExpression.outputPathType == CONST_OUTPUT_PATH_TYPE.BY_PROP">
    <InputWithPrefix v-model="innExpression.outputPathExpressionPre" fieldCode="OUTPUT_PATH_CONFIG_2" @input="outputPathExpressionParamArrChange" prefix="前缀" />

    <SelectWithPrefix v-model="innExpression.outputPathExpressionArrayParam1" @change="outputPathExpressionParamArrChange" prefix="向上几级的Key">
      <el-option v-for="(item, index) in getArrParam1Items" :value="index" :disabled="item.disabled">
        <span style="float: left">{{ '向上' + index + '级节点所在索引' }}</span>
        <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
          {{ item.label }}
        </span>
      </el-option>
    </SelectWithPrefix>

    <SelectWithPrefix v-model="innExpression.outputPathExpressionParam1" fieldCode="OUTPUT_PATH_CONFIG_3" @change="outputPathExpressionParamArrChange" prefix="向上几级的Key">
      <el-option v-for="(item, index) in getParam1Items" :label="'向上' + index + '级'" :value="index">
        <span style="float: left">{{ '向上' + index + '级' }}</span>
        <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
          {{ item.name }}
        </span>
      </el-option>
    </SelectWithPrefix>

    <SelectWithPrefix v-model="innExpression.outputPathExpressionParam2" fieldCode="OUTPUT_PATH_CONFIG_4_2" @change="outputPathExpressionParamArrChange" prefix="匹配的第几段">
      <el-option v-for="(item, index) in getPropertyItems()" :label="item.label" :value="item.label"></el-option>
    </SelectWithPrefix>

    <InputWithPrefix v-model="innExpression.outputPathExpressionSuf" fieldCode="OUTPUT_PATH_CONFIG_5" @input="outputPathExpressionParamArrChange" prefix="后缀" />
  </div>
  <InputWithPrefix v-model="innExpression.outputPathExpression" fieldCode="OUTPUT_PATH_CONFIG_99" @input="handleInputArrSpecValue" prefix="最终目标路径" />
</template>

<script lang="ts" setup>
import { CONST_OUTPUT_PATH_TYPE, CONST_OUTPUT_PATH_TYPE_ITEMS } from '@/utils/constant';
import { DropBean, JsonTreeModel, OutputPathExpression } from '@/utils/model/jsonModel';
import { IDropBean, IBaseOutputPathExpression } from '@/utils/model/jsonModelInterface';
import { getAncestor, getAncestors } from '@/utils/jsonUtil';
import fieldInfo from './fieldInfo.vue';

interface Props {
  data: OutputPathExpression;
  rootNode: JsonTreeModel[];
  currentNode: JsonTreeModel;
}
const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(['update:data', 'onDataChange']);
const outputPathTypeItems = ref<IDropBean[]>(CONST_OUTPUT_PATH_TYPE_ITEMS);
const levelItems = ref<IDropBean[]>([]);
for (let i = 0; i <= 20; i++) {
  levelItems.value.push({ value: i.toString(), label: i.toString() } as DropBean);
}

onMounted(() => {
  innExpression.value.rootNode = props.rootNode;
  innExpression.value.currentNode = props.currentNode;
});
// ✅ 响应式同步
const innExpression = computed(() => {
  return props.data;
});

const outputPathExpressionParamArrChange = (value: string) => {
  emit('update:data', innExpression.value);
  emit('onDataChange', innExpression.value);
};
const handleInputArrSpecValue = (value: string) => {
  innExpression.value.outputPathExpression = value;
  emit('update:data', innExpression.value);
  emit('onDataChange', innExpression.value);
};

const getPropertyItems = (): IDropBean[] => {
  let value: IDropBean[] = [];
  const level = parseInt(innExpression.value.outputPathExpressionParam1!) - 1;
  getAncestor(props.rootNode, props.currentNode, isNaN(level) ? 0 : level)?.children?.forEach((node) => {
    value.push({
      value: node.name,
      label: node.name,
      disabled: false,
    });
  });
  return value;
};

const getParam1Items = computed(() => {
  let value: JsonTreeModel[] = [];
  getAncestors(props.rootNode, props.currentNode).forEach((item, index) => {
    if (index == 0) {
      value.push(item);
    }
    value.push(item);
  });
  return value;
});
const getOutputPathContainArrItems = computed(() => {
  let value: JsonTreeModel[] = [];
  getAncestors(props.rootNode, props.currentNode).forEach((item, index) => {
    if (index == 0) {
      value.push({
        value: item.name,
        label: item.name,
        disabled: true,
      });
      value.push({
        value: item.name,
        label: item.name,
        disabled: true,
      });
    }
    value.push(item);
  });
  return value;
});

const getOutputPathExpressionParam1Items = computed(() => {
  let value: IDropBean[] = [];
  getAncestors(props.rootNode, props.currentNode).forEach((item, index) => {
    if (index == 0) {
      value.push({
        value: item.name,
        label: item.name,
        disabled: true,
      });
      value.push({
        value: item.name,
        label: item.name,
        disabled: true,
      });
    }
    value.push({
      value: item.name,
      label: item.name,
      disabled: false,
    });
  });
  return value;
});

const getArrParam1Items = computed(() => {
  let value: IDropBean[] = [];
  getAncestors(props.rootNode, props.currentNode).forEach((item, index) => {
    if (index == 0) {
      value.push({
        value: item.name,
        label: item.name,
        disabled: true,
      });
      value.push({
        value: item.name,
        label: item.name,
        disabled: true,
      });
    }
    value.push({
      value: item.name,
      label: item.name,
      disabled: false,
    });
  });
  return value;
});
</script>
