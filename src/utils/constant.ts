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
  CURRENT_KEY: 'C',
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
  { value: CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT, label: '直接输入目标路径' },
  { value: CONST_OUTPUT_PATH_TYPE.BY_KEY, label: '以key作为目标路径' },
  { value: CONST_OUTPUT_PATH_TYPE.BY_PROP, label: '以属性值作为目标路径' },
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
  'OUTPUT_PATH_CONFIG_1': {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `目标路径的类型：
      <br/>1、${CONST_OUTPUT_PATH_TYPE_ITEMS[0].label};
      <br/>2、${CONST_OUTPUT_PATH_TYPE_ITEMS[1].label};
      <br/>3、${CONST_OUTPUT_PATH_TYPE_ITEMS[2].label}`,
  },
  'OUTPUT_PATH_CONFIG_2': {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `目标路径的前缀`,
  },
  'OUTPUT_PATH_CONFIG_3': {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `向上几级`,
  },
  'OUTPUT_PATH_CONFIG_4_1': {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `匹配第几段`,
  },
  'OUTPUT_PATH_CONFIG_4_2': {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `向上几级后的节点的属性`,
  },
  'OUTPUT_PATH_CONFIG_5': {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `目标路径的后缀`,
  },
  'OUTPUT_PATH_CONFIG_99': {
    fieldCode: '1',
    fieldName: '',
    fieldType: '1',
    fieldDesc: `最终的目标路径表达式`,
  },
};
