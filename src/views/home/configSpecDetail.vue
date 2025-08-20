$(<template>
  <div>

    <!-- #region 节点信息 -->
    <el-card style="width: 100%;margin: 10px;" shadow="always">
      <el-descriptions title="节点信息" border>
        <el-descriptions-item label="Key">{{innNode.code}}</el-descriptions-item>
        <el-descriptions-item label="值类型">
          <el-tag size="small">{{innNode.type}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="值">{{innNode.value}}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- #endregion 节点信息-->
    
    <!-- #region 输出条件信息-->
    <!-- <el-card style="width: 100%;margin: 10px;" shadow="always">
      <el-descriptions title="输出条件配置" border /> -->
      
      <!-- <el-row v-for="specDetail,index in innSpec.specList" >
        <el-tag>{{ '条件：'+(index+1) }}</el-tag> <el-button :icon="Delete" circle @click="handleDelSpecList(index)" style="margin: 5px;"/>
      </el-row> -->
    <!-- </el-card> -->
    <el-button type="primary" :icon="Plus" circle @click="handleAddSpec" style="margin:10px;"/>
    <!-- endregion 输出条件信息-->

    <el-tabs editable type="border-card" style="margin: 10px;">
      <el-tab-pane v-for="specDetail,index in innSpec.specList" :label="specDetail.whereExpression+(index+1)"> 
          <!-- #region 输出节点信息配置-->
        <el-card style="width: 100%;margin: 10px;" shadow="always">
          <el-descriptions title="输出JSON 值配置" border />
          <el-select v-model="specDetail.keySelectType" @change="handleKeySelectTypeChange" style="width: 240px">
            <el-option
              v-for="item in selOptShiftKeyTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
            
          <el-select  style="width: 100px;margin-left: 20px;" v-model="specDetail.nodeKeyExpressionParam1" @change="handleNodeKeyExpressionParam1" placeholder="向上几级的Key"
            v-show="specDetail.keySelectType==CONST_KEY_SELECT_TYPE.UPPER_NODE">
            <el-option v-for="item in levelItems" :label="'向上'+item.label+'级'" :value="item.value"></el-option>
          </el-select>
          <!-- <el-select  style="width: 100px;margin-left: 20px;" v-model="specDetail.nodeKeyExpressionParam2" @change="specKeyParam1Change" placeholder="匹配的属性名"
            v-show="specDetail.keySelectType==CONST_KEY_SELECT_TYPE.UPPER_NODE"
            >
            <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
          </el-select> -->
          <el-input  style="width: 240px"
              v-show="specDetail.keySelectType==CONST_KEY_SELECT_TYPE.UPPER_NODE" v-model="specDetail.nodeKeyExpressionParam2" @input="handleNodeKeyExpressionParam2"
              placeholder="匹配的属性名"
          />
          <el-input  style="width: 240px"
              v-show="specDetail.keySelectType != CONST_KEY_SELECT_TYPE.CURRENT_NODE"
              :disabled="specDetail.keySelectType == CONST_KEY_SELECT_TYPE.ALL_CURRENT_LEVEL_NODE"
              v-model="specDetail.nodeKeyExpression"
              @input="handleInputSelOptShiftKeyRegularInput"
              placeholder="请输入Key的匹配规则"
          />
          
        </el-card>
        <!-- #endregion 输出节点信息配置-->

        <!-- #region 输出JSON 键Or值配置 -->
        <el-card style="width: 100%;margin: 10px;" shadow="always">
          <el-descriptions title="输出Key 还是 Value" border />
          <el-checkbox-group v-model="specDetail.outputKeyOrValueType" :min="1" :max="3" @change="outputKeyOrValueTypeChange">
            <el-checkbox v-for="item in outputKeyOrValueTypeItems" :key="item.value" :label="item.label" :value="item.value">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
          <!-- <el-radio-group v-model="specDetail.outputKeyOrValueType" @change="outputKeyOrValueTypeChange">
            <el-radio-button v-for="item in outputKeyOrValueTypeItems" :label="item.label" :value="item.value" />
          </el-radio-group> -->
          <!-- <el-select  v-model="specDetail.outputKeyOrValueType"  style="width: 240px;" @change="outputKeyOrValueTypeChange">
            <el-option v-for="item in outputKeyOrValueTypeItems" :label="item.label" :value="item.value"></el-option>
          </el-select> -->

          <!-- <el-select  v-model="specDetail.outputKeys" multiple placeholder="Select" style="width: 640px;padding-top: 7px;" @change="outputKeysChange">
            <el-option v-for="item in levelItems" :label="'向上'+item.label+'级'" :value="item.value"></el-option>
          </el-select> -->
        </el-card>
        <!-- #endregion 输出JSON 键Or值配置-->

        <!-- #region 输出JSON 内容配置 -->
        <el-card style="width: 100%;margin: 10px;" shadow="always">
          <el-descriptions title="输出JSON内容配置" border >
          </el-descriptions>
          
          <!-- #region 输出Key的所有配置 -->
          <el-card v-show="specDetail.outputKeyOrValueType.indexOf(CONST_OUTPUT_KEY_OR_VALUE_TYPE.KEY)!=-1" style="margin: 10px;">
              <el-divider content-position="left">输出多个键</el-divider>
              <el-button type="primary" :icon="Plus" circle @click="handleAddOutputKeyExpression" />
              <!-- 输出Key的所有配置 -->
              <el-row v-for="expression,index in specDetail.outputKeysExpressions" >
                <!-- #region 当选择的输出是键的时候，需要输入键的表达式 -->
                <el-button :icon="Delete" circle @click="handleDelOutputKeyExpression(index)" style="margin: 5px;"/>
                
                <!-- <el-button type="danger" @click="handleDelOutputKeyExpression(index)">删除</el-button> -->
                <!-- <el-button type="primary" @click="handleDelOutputKeyExpression(index)" >删除</el-button> -->
                <el-select  style="width: 150px;" v-model="expression.outputKeyExpressionParam1"  placeholder="向上几级的Key">
                  <el-option v-for="item in levelItems" :label="'向上'+item.label+'级'" :value="item.value"></el-option>
                </el-select>
                <el-select  style="width: 150px;margin-left: 20px;" v-model="expression.outputKeyExpressionParam2"  placeholder="匹配的第几段">
                  <el-option v-for="item in levelItems" :label="'匹配第'+item.label+'段'" :value="item.value"></el-option>
                </el-select>
                <el-tag style="margin:5px;line-height: 24px;">{{ `$(`+expression.outputKeyExpressionParam1+(expression.outputKeyExpressionParam2?','+expression.outputKeyExpressionParam2:'')+')' }}</el-tag>
                <el-select  style="width: 200px;" v-model="expression.outputPathType" >
                  <el-option v-for="item in outputPathTypeItems" :label="item.label" :value="item.value"></el-option>
                </el-select>
                
                <!-- 当把KEY作为目标输出路径 -->
                <div v-show="expression.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_KEY">
                  <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputPathExpressionParam1" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="向上几级的Key">
                      <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputPathExpressionParam2" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="匹配的第几段">
                    <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </div>

                <el-input style="width: 340px" placeholder="请输入目标路径" v-model="expression.outputPathExpression" @input="handleInputArrSpecValue(expression,$event)">
                </el-input>
                <!-- #endregion 当选择的输出是键的时候，需要输入键的表达式-->
              </el-row>
          </el-card>
          <!-- #endregion 输出Key的所有配置 -->
          
          <!-- #region 输出Value的所有配置 -->
          <el-card v-show="specDetail.outputKeyOrValueType.indexOf(CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE)!=-1" style="margin: 10px;">
            <el-divider content-position="left">输出值</el-divider>
            <el-row v-for="expression,index in specDetail.outputValuesExpressions" >
              <!-- #region 当选择的输出是键的时候，需要输入键的表达式 -->
              <!-- <el-button type="primary" @click="handleDelOutputKeyExpression(index)" >删除</el-button> -->
              <!-- <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputValueExpressionParam1"  placeholder="向上几级的Key">
                <el-option v-for="item in levelItems" :label="'向上'+item.label+'级'" :value="item.value"></el-option>
              </el-select>
              <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputKeyExpressionParam2"  placeholder="匹配的第几段">
                <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <el-select  style="width: 200px;" v-model="expression.outputPathType" @change="specValueTypeChange" >
                <el-option v-for="item in outputPathTypeItems" :label="item.label" :value="item.value"></el-option>
              </el-select>

              <!-- 当把KEY作为目标输出路径 -->
              <div v-show="expression.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_KEY">
                <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputPathExpressionParam1" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="向上几级的Key">
                    <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputPathExpressionParam2" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="匹配的第几段">
                  <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>

              <!-- 当把属性作为目标输出路径 -->
              <div v-show="expression.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_PROP">
                <el-input v-model="expression.outputPathExpressionPre" placeholder="前缀" style="width: 150px;"  @input="outputPathExpressionParamArrChange(expression,$event)"/>
                <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputPathExpressionParam1" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="向上几级的Key">
                    <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="expression.outputPathExpressionParam2" placeholder="属性名" style="width: 150px;"  @input="outputPathExpressionParamArrChange(expression,$event)"/>
                <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputPathExpressionParam2" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="匹配的第几段">
                  <el-option v-for="item,index in getPropertyItems(expression)" :label="item.label" :value="item.label"></el-option>
                </el-select>
                <el-input v-model="expression.outputPathExpressionSuf" placeholder="后缀" style="width: 150px;"  @input="outputPathExpressionParamArrChange(expression,$event)"/>
              </div>

              <!-- <el-select  style="width: 100px;margin-left: 20px;" v-model="specDetail.outputPathExpressionParam1" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="向上几级的Key"
                v-show="expression.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_KEY">
                <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-select  style="width: 100px;margin-left: 20px;" v-model="specDetail.outputPathExpressionParam2" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="匹配的第几段"
                v-show="expression.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_KEY">
                <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <el-input style="width: 840px" placeholder="请输入目标路径" v-model="expression.outputPathExpression" @input="handleInputArrSpecValue(expression,$event)">
              </el-input>
              <!-- #endregion 当选择的输出是键的时候，需要输入键的表达式-->
            </el-row>
          </el-card>
          <!-- #endregion 输出Value的所有配置 -->

          <!-- #region 输出特定内容的所有有配置 -->
          <el-card v-show="specDetail.outputKeyOrValueType.indexOf(CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE)!=-1" style="margin: 10px;">
            <el-divider content-position="left">输出特定内容</el-divider>
            <el-button type="primary" :icon="Plus" circle @click="handleAddOutputConstValueExpression" />
            <el-row v-for="expression,index in specDetail.outputConstValuesExpressions" >
              <!-- #region 当选择的输出是键的时候，需要输入键的表达式 -->
              <!-- <el-button type="primary" @click="handleDelOutputKeyExpression(index)" >删除</el-button> -->
              <!-- <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputValueExpressionParam1"  placeholder="向上几级的Key">
                <el-option v-for="item in levelItems" :label="'向上'+item.label+'级'" :value="item.value"></el-option>
              </el-select>
              <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputKeyExpressionParam2"  placeholder="匹配的第几段">
                <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <el-input v-model="expression.outputConstValue" placeholder="请输入输出的特定文本" style="width: 200px;"></el-input>
              <el-select  style="width: 200px;" v-model="expression.outputPathType" @change="specValueTypeChange" >
                <el-option v-for="item in outputPathTypeItems" :label="item.label" :value="item.value"></el-option>
              </el-select>

              <!-- 当把KEY作为目标输出路径 -->
              <div v-show="expression.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_KEY">
                <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputPathExpressionParam1" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="向上几级的Key">
                    <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputPathExpressionParam2" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="匹配的第几段">
                  <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>

              <!-- 当把属性作为目标输出路径 -->
              <div v-show="expression.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_PROP">
                <el-input v-model="expression.outputPathExpressionPre" placeholder="前缀" style="width: 150px;"  @input="outputPathExpressionParamArrChange(expression,$event)"/>
                <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputPathExpressionParam1" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="向上几级的Key">
                    <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="expression.outputPathExpressionParam2" placeholder="属性名" style="width: 150px;"  @input="outputPathExpressionParamArrChange(expression,$event)"/>
                <el-select  style="width: 100px;margin-left: 20px;" v-model="expression.outputPathExpressionParam2" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="匹配的第几段">
                  <el-option v-for="item,index in getPropertyItems(expression)" :label="item.label" :value="item.label"></el-option>
                </el-select>
                <el-input v-model="expression.outputPathExpressionSuf" placeholder="后缀" style="width: 150px;"  @input="outputPathExpressionParamArrChange(expression,$event)"/>
              </div>

              <!-- <el-select  style="width: 100px;margin-left: 20px;" v-model="specDetail.outputPathExpressionParam1" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="向上几级的Key"
                v-show="expression.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_KEY">
                <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-select  style="width: 100px;margin-left: 20px;" v-model="specDetail.outputPathExpressionParam2" @change="outputPathExpressionParamArrChange(expression,$event)" placeholder="匹配的第几段"
                v-show="expression.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_KEY">
                <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
              </el-select> -->
              <el-input style="width: 840px" placeholder="请输入目标路径" v-model="expression.outputPathExpression" @input="handleInputArrSpecValue(expression,$event)">
              </el-input>
              <!-- #endregion 当选择的输出是键的时候，需要输入键的表达式-->
            </el-row>
          </el-card>
          <!-- #endregion 输出特定内容的所有的所有配置 -->


          <!-- #region 单个的json输出匹配规则，待删除 -->
          <template v-show="false">
            <el-row v-show="false">
              <el-col colspan="12">
                <!-- <el-input
                    v-model="specDetail.outputPathExpression"
                    style="width: 240px"
                    @input="handleInputSpecValue"
                    placeholder="请输入目标路径"
                /> -->
                <el-select  style="width: 200px;" v-model="specDetail.outputPathType" @change="specValueTypeChange" >
                  <el-option v-for="item in outputPathTypeItems" :label="item.label" :value="item.value"></el-option>
                </el-select>

                <!-- #region 当选择的输出是键的时候，需要输入键的表达式 -->
                <el-select  style="width: 100px;margin-left: 20px;" v-model="specDetail.outputPathExpressionParam1" @change="outputPathExpressionParamChange" placeholder="向上几级的Key"
                  v-show="specDetail.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_KEY">
                  <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select  style="width: 100px;margin-left: 20px;" v-model="specDetail.outputPathExpressionParam2" @change="outputPathExpressionParamChange" placeholder="匹配的第几段"
                  v-show="specDetail.outputPathType==CONST_OUTPUT_PATH_TYPE.BY_KEY">
                  <el-option v-for="item in levelItems" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <!-- #endregion 当选择的输出是键的时候，需要输入键的表达式-->
                <el-input style="width: 840px" placeholder="请输入目标路径" v-model="specDetail.outputPathExpression" @input="handleInputSpecValue">
                </el-input>
              </el-col>
            </el-row>
          </template>
          <!-- #endregion 单个的json输出匹配规则，待删除 -->
        </el-card>
        <!-- #endregion 输出JSON 键配置 -->
      
      </el-tab-pane>
    </el-tabs>

    
  </div>
</template>

<script lang="ts" setup>
import { debug } from 'console'
import { CheckboxValueType, selectEmits } from 'element-plus'
import {SpecModel,JsonTreeModel,DropBean, OutputKeyExpression,SpecDetail} from "../../utils/model/jsonModel";
import {CONST_KEY_SELECT_TYPE,CONST_KEY_SELECT_TYPE_ITEMS,CONST_OUTPUT_PATH_TYPE_ITEMS,CONST_OUTPUT_PATH_TYPE,CONST_OUTPUT_KEY_OR_VALUE_TYPE,CONST_OUTPUT_KEY_OR_VALUE_TYPE_ITEMS} from "@/utils/constant";
import { Delete,Plus } from '@element-plus/icons-vue'
import exp from 'constants';
import {getAncestor} from '@/utils/jsonUtil'

const emit = defineEmits(['update:node'])
/* props */
interface Props {
  // spec?: SpecModel|null,
  node:JsonTreeModel,
  rootNode:JsonTreeModel[]
}

const props = withDefaults(defineProps<Props>(), {
  
})
// ✅ 响应式同步
const innNode = computed(() => props.node);
const innSpec = computed<SpecModel>(() => {
  return props.node.spec ?? {
    specList: [{
      whereExpression: "规则",
      keySelectType: CONST_KEY_SELECT_TYPE.CURRENT_NODE,
      nodeKeyExpression: innNode.value.code,
      nodeKeyExpressionParam1: "0",
      nodeKeyExpressionParam2: "",
      outputPathExpression: "",
      outputKeys:[],
      outputKeysExpressions:[],
      outputConstValuesExpressions:[],
      outputValuesExpressions:[{outputPathType:CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT}],
      outputKeyOrValueType: [CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE],
      outputPathType: CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT,
      outputPathExpressionParam1: "0",
      outputPathExpressionParam2: "0"
    }],

  };
})
// select 组件
const selOptShiftKeyTypeOptions = ref(CONST_KEY_SELECT_TYPE_ITEMS);
const outputPathTypeItems = ref<DropBean[]>(CONST_OUTPUT_PATH_TYPE_ITEMS);
const outputKeyOrValueTypeItems = ref<DropBean[]>(CONST_OUTPUT_KEY_OR_VALUE_TYPE_ITEMS)
const levelItems = ref<DropBean[]>([
]);
for(let i=0;i<=20;i++){
  levelItems.value.push({ value:i.toString(),label:i.toString()});
}
function handleKeySelectTypeChange(value: string) {
  switch(value){
    case CONST_KEY_SELECT_TYPE.CURRENT_NODE:
      innSpec.value.nodeKeyExpression = innNode.value.code;
      break;
    case CONST_KEY_SELECT_TYPE.ALL_CURRENT_LEVEL_NODE:
      innSpec.value.nodeKeyExpression = "*";
      break;
    case CONST_KEY_SELECT_TYPE.EXPRESSION_NODE:
      innSpec.value.nodeKeyExpression = "*";
      break;
    case CONST_KEY_SELECT_TYPE.UPPER_NODE:
      innSpec.value.nodeKeyExpression = "@0";
  }
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}

const handleInputSpecValue = (value: string) => {
  innSpec.value.outputPathExpression = value;
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}
const handleInputArrSpecValue = (expression:OutputKeyExpression,value: string) => {
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}

const handleInputSelOptShiftKeyRegularInput = (value: string) => {
  innSpec.value.nodeKeyExpression = value;
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}
const outputKeyOrValueTypeChange = (checkBoxValue: CheckboxValueType[]) => {
  const value = checkBoxValue.map(v => v.toString()) // 转为字符串数组使用
  //包含Key
  if(value.indexOf(CONST_OUTPUT_KEY_OR_VALUE_TYPE.KEY)!=-1){
    // if(!innSpec.value.outputKeys||innSpec.value.outputKeys?.length == 0){
    //   innSpec.value.outputKeys = ['0'];
    // }
    if(!innSpec.value.outputKeysExpressions||innSpec.value.outputKeysExpressions?.length == 0){ 
      innSpec.value.outputKeysExpressions = [
        {
          outputKeyExpressionParam1: '0',
          outputPathType: CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT,
          outputPathExpression: '',
          outputPathExpressionParam1: '0',
          outputPathExpressionParam2: '1'
        }
      ];
    }
  }
  else{
    innSpec.value.outputKeysExpressions.splice(0, innSpec.value.outputKeysExpressions.length); 
  }
  //包含Value
  if(value.indexOf(CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE)!=-1){
    if(!innSpec.value.outputValuesExpressions||innSpec.value.outputValuesExpressions?.length == 0){ 
      innSpec.value.outputValuesExpressions = [
        {
          outputPathType: CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT,
          outputPathExpression: '',
          outputPathExpressionParam1: '0',
          outputPathExpressionParam2: '0'
        }
      ];
    }
  }
  else{
    innSpec.value.outputValuesExpressions.splice(0, innSpec.value.outputValuesExpressions.length); 
  }  
  
  //包含ConstValue
  if(value.indexOf(CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE)!=-1){
    if(!innSpec.value.outputConstValuesExpressions||innSpec.value.outputConstValuesExpressions?.length == 0){ 
      innSpec.value.outputConstValuesExpressions = [
        {
          outputPathType: CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT,
          outputPathExpression: '',
          outputPathExpressionParam1: '0',
          outputPathExpressionParam2: '0'
        }
      ];
    }
  }
  else{
    innSpec.value.outputConstValuesExpressions.splice(0, innSpec.value.outputConstValuesExpressions.length); 
  }
  
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}

const specValueTypeChange = (value: string) => { 
  innSpec.value.outputPathType = value;
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
  //匹配key
  if(value ==CONST_OUTPUT_PATH_TYPE.BY_KEY){
    innSpec.value.outputPathExpression = `&(${innSpec.value.outputPathExpressionParam1},${innSpec.value.outputPathExpressionParam2})`
  }
}

const outputPathExpressionParamChange = (value: string) => { 
  innSpec.value.outputPathExpression = `&(${innSpec.value.outputPathExpressionParam1},${innSpec.value.outputPathExpressionParam2})`

  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}
const outputPathExpressionParamArrChange = (expression:OutputKeyExpression,value: string) => { 
  const pre = !expression.outputPathExpressionPre?'':expression.outputPathExpressionPre;
  const suf = !expression.outputPathExpressionSuf?'':expression.outputPathExpressionSuf;
  const param1 = expression.outputPathExpressionParam1;
  const param2 = expression.outputPathExpressionParam2;
  if(expression.outputPathType === CONST_OUTPUT_PATH_TYPE.BY_KEY){
    if(param2){
      expression.outputPathExpression = `${pre}&(${param1},${param2})${suf}`
    }
    else{
      expression.outputPathExpression = `${pre}&(${param1})${suf}`
    }
  }
  else if(expression.outputPathType === CONST_OUTPUT_PATH_TYPE.BY_PROP){ 
    if(param2){
      expression.outputPathExpression = `${pre}@(${param1},${param2})${suf}`
    }
    else{
      expression.outputPathExpression = `${pre}&(${param1})${suf}`
    }
    
  }
  else{
    expression.outputPathExpression = '表达式有误';
  }
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}

const handleNodeKeyExpressionParam1 = (value: string) => { 
  if(!innSpec.value.nodeKeyExpressionParam2){
    innSpec.value.nodeKeyExpression = `@(${innSpec.value.nodeKeyExpressionParam1})`
  }
  else{
    innSpec.value.nodeKeyExpression = `@(${innSpec.value.nodeKeyExpressionParam1},${innSpec.value.nodeKeyExpressionParam2})`
  }

  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}
const handleNodeKeyExpressionParam2 = (value: string) => { 
  if(!innSpec.value.nodeKeyExpressionParam2){
    innSpec.value.nodeKeyExpression = `@(${innSpec.value.nodeKeyExpressionParam1})`
  }
  else{
    innSpec.value.nodeKeyExpression = `@(${innSpec.value.nodeKeyExpressionParam1},${innSpec.value.nodeKeyExpressionParam2})`
  }

  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}

const outputKeysChange = (value: string[]) => { 
  innSpec.value.outputKeys = value;
  innSpec.value.outputKeysExpressions = [];
  value.forEach(element => { 
    innSpec.value.outputKeysExpressions.push({
      outputKeyExpressionParam1:element
    });
  });
  innNode.value.spec = innSpec.value;
  emit('update:node', innNode.value);
}

const handleAddOutputKeyExpressionByIndex = (index: number) => { 
  innSpec.value.outputKeysExpressions.splice(index+1, 0, {
    outputKeyExpressionParam1:"0"
  });
}
const handleDelOutputKeyExpression = (index: number) => { 
  innSpec.value.outputKeysExpressions.splice(index,1);
}
const handleDelSpecList = (index: number) => { 
  innSpec.value.specList.splice(index,1);
}

const handleAddOutputKeyExpression = () => { 
  innSpec.value.outputKeysExpressions.push({
    outputKeyExpressionParam1:"0"
  });
}

const handleAddOutputConstValueExpression = () => { 
  innSpec.value.outputConstValuesExpressions.push({
  });
}

const getPropertyItems = (expression: OutputKeyExpression): DropBean[] => { 
  let value:DropBean[] = [];
  const level = parseInt(expression.outputPathExpressionParam1!)-1;
  getAncestor(props.rootNode, innNode.value, isNaN(level) ? 0 : level)?.children?.forEach(node => { 
    value.push({
      value:node.name,
      label:node.name
    });
  });
  return value;
}

const handleAddSpec = () => { 
  innSpec.value.specList.push({
    whereExpression: '规则',
    keySelectType: "0",
    nodeKeyExpression: "",
    nodeKeyExpressionParam1: "",
    nodeKeyExpressionParam2: "",
    outputKeyOrValueType: ["0"],
    outputKeys: [],
    outputKeysExpressions: [],
    outputValuesExpressions: [],
    outputConstValuesExpressions: [],
    outputPathExpression: "",
    outputPathType: CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT,
    outputPathExpressionParam1: "0",
    outputPathExpressionParam2: "0"
  });
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