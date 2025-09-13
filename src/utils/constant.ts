import { DropBean } from './model/jsonModel';
import { IFieldInfo } from './model/jsonModelInterface';

/**
 * 键的匹配规则
 */
export const CONST_KEY_SELECT_TYPE = {
  CURRENT_NODE: '0',
  ALL_CURRENT_LEVEL_NODE: '1',
  EXPRESSION_NODE: '2',
  UPPER_NODE: '3',
};

export const CONST_OUTPUT_KEY_PARAM1_TYPE = {
  CURRENT_KEY: '0',
};

/**
 * 键的匹配规则下拉
 */
export const CONST_KEY_SELECT_TYPE_ITEMS = [
  { value: CONST_KEY_SELECT_TYPE.CURRENT_NODE, label: '当前节点' },
  { value: CONST_KEY_SELECT_TYPE.ALL_CURRENT_LEVEL_NODE, label: '本级所有其它节点' },
  { value: CONST_KEY_SELECT_TYPE.EXPRESSION_NODE, label: '本级所有符合条件的节点' },
  { value: CONST_KEY_SELECT_TYPE.UPPER_NODE, label: '上级节点' },
];

/**
 *  输出路径类型
 * */
export const CONST_OUTPUT_PATH_TYPE = {
  DIRECT_INPUT: '0',
  BY_KEY: '1',
  BY_PROP: '2', //根据属性
};
/**
 * 输出路径类型下拉
 */
export const CONST_OUTPUT_PATH_TYPE_ITEMS = [
  { value: CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT, label: '直接输入目标路径' } as DropBean,
  { value: CONST_OUTPUT_PATH_TYPE.BY_KEY, label: '以key作为目标路径' } as DropBean,
  { value: CONST_OUTPUT_PATH_TYPE.BY_PROP, label: '以属性值作为目标路径' } as DropBean,
];

/**
 * 输出键、值、固定内容
 */
export const CONST_OUTPUT_KEY_OR_VALUE_TYPE = {
  KEY: '0',
  VALUE: '1',
  CONST_VALUE: '2',
};

/**
 * 输出键还是值下拉
 */
export const CONST_OUTPUT_KEY_OR_VALUE_TYPE_ITEMS = [
  { value: CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE, label: '输出value' },
  { value: CONST_OUTPUT_KEY_OR_VALUE_TYPE.KEY, label: '输出key' },
  { value: CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE, label: '输出固定内容' },
];

export const CONST_FILED_INFO_ITEMS = {
  UNKONWFIELD: {
    fieldCode: 'UNKONW',
    fieldName: 'UNKONW',
    fieldType: 'UNKONW',
    fieldDesc: 'UNKONW',
  },
  '1': {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: '当字段值等于文本框中输入的内容时则输出数据，否则始终输出。',
  },
  OUTPUT_PATH_JSON_KEY_1: {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `节点类型：
      <br/>1、${CONST_KEY_SELECT_TYPE_ITEMS[0].label}：只输出当前节点;
      <br/>2、${CONST_KEY_SELECT_TYPE_ITEMS[1].label}：输出本级所有节点，如果本级其它节点已经配置了匹配规则，则本规则优先级低;
      <br/>3、${CONST_KEY_SELECT_TYPE_ITEMS[2].label}：输出本级所有符合条件的节点，可以使用通配符，参考JOLT;
      <br/>3、${CONST_KEY_SELECT_TYPE_ITEMS[3].label}：输出祖先级节点的相关属性`,
  },
  OUTPUT_PATH_CONFIG_1: {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `目标路径的类型：
      <br/>1、${CONST_OUTPUT_PATH_TYPE_ITEMS[0].label};
      <br/>2、${CONST_OUTPUT_PATH_TYPE_ITEMS[1].label};
      <br/>3、${CONST_OUTPUT_PATH_TYPE_ITEMS[2].label}`,
  },
  OUTPUT_PATH_CONFIG_2: {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `目标路径的前缀。
说明：目标路径的前缀内容可以任意输入，当输入内容包含[]时，请以.结尾`,
  },
  OUTPUT_PATH_CONFIG_3: {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `向上几级，下拉左侧为向上层级，右侧为该层级的节点属性名称：
1、当节点类型为当前节点、本级所有其它节点、本级所有符合条件的节点时，0级-1级均为本节点、`,
  },
  OUTPUT_PATH_CONFIG_4_1: {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `<pre>
匹配第几段：
举例：如果key为A-B-C;节点规则表达式为*-*-*,那么:
第0段：整个key(A-B-C)
第1段：第一个*匹配的位置：A
第2段：第二个*匹配的位置：B
第3段：第三个*匹配的位置：C</pre>
    `,
  },
  OUTPUT_PATH_CONFIG_4_2: {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `向上几级后的节点的属性`,
  },
  OUTPUT_PATH_CONFIG_5: {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `目标路径的后缀`,
  },
  OUTPUT_PATH_CONFIG_99: {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `<pre>最终的目标路径表达式:
举例：
1. data.devCode ： data下的devCode属性
2. data[] ： data数组
更多请参考jlot</pre>`,
  },
  OUTPUT_PATH_CONFIG_BY_KEY_1: {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `<pre>当前缀输入包含[]时展示该属性:
说明：当前缀输入包含[]时，此处选择的为填充[]中的索引信息，右侧下拉分为左右两个部分，左半部分为向上层级，右半部分为该层级下的节点属性名称，实际转换时根据左半部分进行转换，右半部分是为了更容易选择对应的层级
</pre>`,
  },
};
