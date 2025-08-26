export interface IBaseOutputPathExpression {
  outputPathType: string; //输出路径类型，直接输入还是表达式等
  outputPathExpression?: string; //输出路径表达式
  outputPathExpressionPre?: string; //表达式前缀
  outputPathExpressionParam1?: string; //输出路径参数1
  outputPathExpressionParam2?: string; //输出路径参数2
  outputPathExpressionSuf?: string; //表达式后缀
  outputPathIsContainUpperNode: boolean; //是否包含祖先节点
}

export interface IOutputKeyExpression extends IBaseOutputPathExpression {
  outputKeyExpressionParam1: string;
  outputKeyExpressionParam2?: string;
  outputKeyExpression: string;
}
export interface IOutputValueExpression extends IBaseOutputPathExpression {}

export interface ISpecDetail {
  title?: string;
  whereExpression?: IWhereExpression;
  keySelectType: string; //键的匹配规则
  nodeKeyExpression: string;
  nodeKeyExpressionParam1: string;
  nodeKeyExpressionParam2: string;
  outputKeyOrValueType: string[]; //输出键还是值还是两者都有
  outputKeys: string[]; //输出为Key时，可以匹配多个key
  outputKeysExpressions: IOutputKeyExpression[]; //输出的为键时的表达式数组
  outputValuesExpressions: IOutputValueExpression[]; //输出的为值时的表达式数组
  outputConstValuesExpressions: IOutputConstValueExpression[]; //输出的为值时的表达式数组
  outputPathExpression: string;
  outputPathType: string; //输出路径类型，直接输入还是表达式等
  outputPathExpressionParam1: string; //输出路径参数1
  outputPathExpressionParam2: string; //输出路径参数2
}

export interface IWhereExpression {
  nodeKeyExpression?: string;
  whereExpression?: string;
}
export interface IDropBean {
  value: string;
  label: string;
}

export interface IOutputConstValueExpression extends IBaseOutputPathExpression {
  outputConstValue: string;
}

export interface IFieldInfo {
  fieldCode: string;
  fieldName: string;
  fieldType: string;
  fieldDesc: string;
}
