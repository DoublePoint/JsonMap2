import { CONST_OUTPUT_KEY_OR_VALUE_TYPE } from '../constant';

export interface JsonTreeModel {
  id: string;
  code: string;
  name: string;
  type: string;
  value?: any;
  spec?: SpecModel;
  children?: JsonTreeModel[];
  parent?: JsonTreeModel;
  index?: number; // 仅在数组元素中使用
}

// export class SpecModel {
//   keySelectType="";
//   nodeKeyExpression="";
//   outputPathExpression="";
//   outputPathType="";
//   outputPathExpressionParam1="";
//   outputPathExpressionParam2=""
// }

export interface SpecModel {
  specList: SpecDetail[];
  // keySelectType: string; //键的匹配规则
  // nodeKeyExpression: string;
  // nodeKeyExpressionParam1: string;
  // nodeKeyExpressionParam2: string;
  // outputKeyOrValueType: string[]; //输出键还是值还是两者都有
  // outputKeys: string[]; //输出为Key时，可以匹配多个key
  // outputKeysExpressions: OutputKeyExpression[]; //输出的为键时的表达式数组
  // outputValuesExpressions: OutputValueExpression[]; //输出的为值时的表达式数组
  // outputConstValuesExpressions: OutputConstValueExpression[]; //输出的为值时的表达式数组
  // outputPathExpression: string;
  // outputPathType: string; //输出路径类型，直接输入还是表达式等
  // outputPathExpressionParam1: string; //输出路径参数1
  // outputPathExpressionParam2: string; //输出路径参数2
}

export interface SpecDetail {
  whereExpression: string;
  keySelectType: string; //键的匹配规则
  nodeKeyExpression: string;
  nodeKeyExpressionParam1: string;
  nodeKeyExpressionParam2: string;
  outputKeyOrValueType: string[]; //输出键还是值还是两者都有
  outputKeys: string[]; //输出为Key时，可以匹配多个key
  outputKeysExpressions: OutputKeyExpression[]; //输出的为键时的表达式数组
  outputValuesExpressions: OutputValueExpression[]; //输出的为值时的表达式数组
  outputConstValuesExpressions: OutputConstValueExpression[]; //输出的为值时的表达式数组
  outputPathExpression: string;
  outputPathType: string; //输出路径类型，直接输入还是表达式等
  outputPathExpressionParam1: string; //输出路径参数1
  outputPathExpressionParam2: string; //输出路径参数2
}

export interface DropBean {
  value: string;
  label: string;
}

export interface OutputKeyExpression {
  outputKeyExpressionParam1?: string;
  outputKeyExpressionParam2?: string;
  outputPathType?: string; //输出路径类型，直接输入还是表达式等
  outputPathExpression?: string; //输出路径表达式
  outputPathExpressionPre?: string; //表达式前缀
  outputPathExpressionParam1?: string; //输出路径参数1
  outputPathExpressionParam2?: string; //输出路径参数2
  outputPathExpressionSuf?: string; //表达式后缀
}
export interface OutputValueExpression {
  outputPathType?: string; //输出路径类型，直接输入还是表达式等
  outputPathExpression?: string; //输出路径表达式
  outputPathExpressionPre?: string; //表达式前缀
  outputPathExpressionParam1?: string; //输出路径参数1
  outputPathExpressionParam2?: string; //输出路径参数2
  outputPathExpressionSuf?: string; //表达式后缀
}
export interface OutputConstValueExpression {
  outputConstValue?: string;
  outputPathType?: string; //输出路径类型，直接输入还是表达式等
  outputPathExpression?: string; //输出路径表达式
  outputPathExpressionPre?: string; //表达式前缀
  outputPathExpressionParam1?: string; //输出路径参数1
  outputPathExpressionParam2?: string; //输出路径参数2
  outputPathExpressionSuf?: string; //表达式后缀
}

export interface OutputPathExpression {
  outputPathType: string; //输出路径类型，直接输入还是表达式等
  outputPathExpressionParam1: string; //输出路径参数1
  outputPathExpressionParam2: string; //输出路径参数2
}
