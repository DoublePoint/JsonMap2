<template>
  <div>

    <el-card style="width: 480px" shadow="always">
      <el-descriptions title="节点信息" border>
        <el-descriptions-item label="Key">{{innNode.code}}</el-descriptions-item>
        <el-descriptions-item label="值类型">
          <el-tag size="small">{{innNode.type}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="值">{{innNode.value}}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-row>
      <el-col colspan="12">

        <!-- 匹配当前节点；全部匹配；正则匹配 层级：1.-->
        <el-select v-model="innSpec.keySelectType" @change="selOptShiftKeyTypeChange" style="width: 240px">
          <el-option
            v-for="item in selOptShiftKeyTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <!-- 全部匹配或正则匹配时，匹配表达式 层级：1-1.-->
        <el-input  style="width: 240px"
            v-show="innSpec.keySelectType == '2'|| innSpec.keySelectType == '1'"
            :readonly="innSpec.keySelectType == '1'"
            v-model="innSpec.nodeKeyExpression"
            @input="handleInputSelOptShiftKeyRegularInput"
            placeholder="请输入Key的匹配规则"
        />

        <!-- 当选择的是正则匹配时，选择本节点匹配还是子节点匹配 层级：1-2. -->
        <el-select v-model="regularChildrenKeyType" 
          v-show="innSpec.keySelectType == '2'&&innNode.type=='object'"
          style="width: 240px">
          <el-option
            v-for="item in regularChildrenKeyTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <!-- 当选择的是子节点匹配时，构造节点所有属性下拉，便于选择 -->
        <el-row v-for="item in regularChildrenKeyOptions" v-show="regularChildrenKeyType == '1'" :key="item.value">
            <el-select style="width: 240px">
              <el-option
                v-for="item in regularChildrenKeyOptions"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input :placeholder="item.label" style="width: 240px"></el-input>
        </el-row>
        

        <!-- 目标路径 -->
        <el-input
            v-show="regularChildrenKeyType== '0'"
            v-model="innSpec.outputPathExpression"
            style="width: 240px"
            @input="handleInputSpecValue"
            placeholder="请输入目标路径"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { debug } from 'console'
import { selectEmits } from 'element-plus'
import {SpecModel,JsonTreeModel,DropBean} from "../../utils/model/jsonModel";

const emit = defineEmits(['update:node'])
/* props */
interface Props {
  // spec?: SpecModel|null,
  node:JsonTreeModel
}

const props = withDefaults(defineProps<Props>(), {
  
})
// ✅ 响应式同步
const innNode = computed(() => props.node);
const innSpec = computed<SpecModel>(() => {
  return props.node.spec ?? {
    keySelectType: "0",
    nodeKeyExpression: "",
    outputPathExpression: "",
    outputPathType: "0",
    outputPathExpressionParam1: "",
    outputPathExpressionParam2: ""
  };
})
// select 组件
const selOptShiftKeyTypeOptions = ref([
  { value:"0",label:"当前节点"},
  { value:"1",label:"本级所有其它节点"},
  { value:"2",label:"本级所有符合条件的节点"},
]);
const regularChildrenKeyTypeOptions = ref([
  { value:"0",label:"当前节点"},
  { value:"1",label:"子节点"},
]);
const regularChildrenKeyOptions = ref<DropBean[]>([]);

const regularChildrenKeyType = ref("0");

const regularChildrenKey = ref("");

function selOptShiftKeyTypeChange(value: string) {
  if(value=="0"){
    innSpec.value.nodeKeyExpression = "";
  }
  if(value=="1"){
    innSpec.value.nodeKeyExpression = "*";
  }
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);

  if(innNode.value.type=="object"){
    regularChildrenKeyOptions.value=[];
      innNode.value.children?.forEach(element => { 
        regularChildrenKeyOptions.value.push({
          value:element.code,
          label:element.name
        });
    });
  }
}

/**
 * 正则匹配
 *  - 当匹配当前节点还是子节点发生变化时
 * @param value 
 */
function regularChildrenKeyTypeChange(value: string) {
  regularChildrenKeyOptions.value=[];
}

const handleInputSpecValue = (value: string) => {
  innSpec.value.outputPathExpression = value;
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}
const handleInputSelOptShiftKeyRegularInput = (value: string) => {
  innSpec.value.nodeKeyExpression = value;
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}

</script>
<style>
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
.el-select,.el-input{
  margin:5px;
}
</style>