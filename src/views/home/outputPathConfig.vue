<template>
  <el-select style="width: 200px" v-model="innExpression.outputPathType">
    <!-- 直接输入目标路径、以key作为目标路径、以属性值作为目标路径 -->
    <el-option v-for="item in outputPathTypeItems" :label="item.label" :value="item.value"></el-option>
  </el-select>

  <!-- 当把KEY作为目标输出路径 -->
  <div v-show="innExpression.outputPathType == CONST_OUTPUT_PATH_TYPE.BY_KEY">
    <el-input v-model="innExpression.outputPathExpressionPre" placeholder="前缀" style="width: 150px" @input="outputPathExpressionParamArrChange" />
    <el-select style="width: 200px; margin-left: 20px" v-model="innExpression.outputPathExpressionParam1" @change="outputPathExpressionParamArrChange" placeholder="向上几级的Key">
      <el-option v-for="(item, index) in getParam1Items" :label="'向上' + index + '级'" :value="index">
        <span style="float: left">{{ '向上' + index + '级' }}</span>
        <span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
          {{ item.name }}
        </span>
      </el-option>
    </el-select>
    <el-select style="width: 100px; margin-left: 20px" v-model="innExpression.outputPathExpressionParam2" @change="outputPathExpressionParamArrChange" placeholder="匹配的第几段">
      <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-checkbox v-model="innExpression.outputPathIsContainUpperNode" style="margin-left: 20px">包含上级节点</el-checkbox>
    <!-- {{ innExpression.outputPathExpressionParam1Node?.code }} -->
    <el-input v-model="innExpression.outputPathExpressionSuf" placeholder="后缀" style="width: 150px" @input="outputPathExpressionParamArrChange" />
  </div>

  <!-- 当把属性作为目标输出路径 -->
  <div v-show="innExpression.outputPathType == CONST_OUTPUT_PATH_TYPE.BY_PROP">
    <el-input v-model="innExpression.outputPathExpressionPre" placeholder="前缀" style="width: 150px" @input="outputPathExpressionParamArrChange" />
    <el-select style="width: 100px; margin-left: 20px" v-model="innExpression.outputPathExpressionParam1" @change="outputPathExpressionParamArrChange" placeholder="向上几级的Key">
      <el-option v-for="item in levelItems" :label="item.label" :value="item.value" key=""></el-option>
    </el-select>
    <el-input v-model="innExpression.outputPathExpressionParam2" placeholder="属性名" style="width: 150px" @input="outputPathExpressionParamArrChange" />
    <el-select style="width: 100px; margin-left: 20px" v-model="innExpression.outputPathExpressionParam2" @change="outputPathExpressionParamArrChange" placeholder="匹配的第几段">
      <el-option v-for="(item, index) in getPropertyItems()" :label="item.label" :value="index"></el-option>
    </el-select>
    <el-input v-model="innExpression.outputPathExpressionSuf" placeholder="后缀" style="width: 150px" @input="outputPathExpressionParamArrChange" />
  </div>
  <el-input style="width: 340px" placeholder="请输入目标路径" v-model="innExpression.outputPathExpression" @input="handleInputArrSpecValue"> </el-input>
</template>

<script lang="ts" setup>
import { CONST_OUTPUT_PATH_TYPE, CONST_OUTPUT_PATH_TYPE_ITEMS } from '@/utils/constant';
import { JsonTreeModel, OutputPathExpression } from '@/utils/model/jsonModel';
import { IDropBean, IBaseOutputPathExpression } from '@/utils/model/jsonModelInterface';
import { getAncestor, getAncestors } from '@/utils/jsonUtil';

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
  levelItems.value.push({ value: i.toString(), label: i.toString() });
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
</script>
