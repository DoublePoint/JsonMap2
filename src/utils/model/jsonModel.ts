import { Type } from 'class-transformer';
import * as Constant from '../constant';
import { build$, getCodePath, getCodePathById, replaceSpecialCharacters } from '../jsonUtil';
import { IOutputKeyExpression, ISpecDetail, IOutputValueExpression, IWhereExpression, IOutputConstValueExpression, IBaseOutputPathExpression } from './jsonModelInterface';

export class JsonTreeModel {
  id: string;
  code: string;
  name: string;
  type: string;
  value?: any;

  @Type(() => SpecModel)
  spec?: SpecModel;

  @Type(() => JsonTreeModel)
  children?: JsonTreeModel[];

  @Type(() => JsonTreeModel)
  parent?: JsonTreeModel;
  index?: number; // 仅在数组元素中使用

  constructor(spec?: SpecModel) {
    this.id = '';
    this.code = '';
    this.name = '';
    this.type = '';
    this.spec = spec;
  }
}

export class SpecModel {
  @Type(() => SpecDetail)
  specList: SpecDetail[];

  constructor(currentNode: JsonTreeModel, rootNode: JsonTreeModel[]) {
    this.specList = [new SpecDetail(currentNode, rootNode)];
  }
}

export class SpecDetail implements ISpecDetail {
  title: string;
  whereExpression: IWhereExpression;
  keySelectType: string; //键的匹配规则
  nodeKeyExpression: string;
  nodeKeyExpressionParam1: string;
  nodeKeyExpressionParam2: string;
  outputKeyOrValueType: string[]; //输出键还是值还是两者都有
  outputKeys: string[]; //输出为Key时，可以匹配多个key
  @Type(() => OutputKeyExpression)
  outputKeysExpressions: OutputKeyExpression[]; //输出的为键时的表达式数组
  @Type(() => OutputValueExpression)
  outputValuesExpressions: OutputValueExpression[]; //输出的为值时的表达式数组
  @Type(() => OutputConstValueExpression)
  outputConstValuesExpressions: OutputConstValueExpression[]; //输出的为值时的表达式数组
  outputPathExpression: string;
  outputPathType: string; //输出路径类型，直接输入还是表达式等
  outputPathExpressionParam1: string; //输出路径参数1
  outputPathExpressionParam2: string; //输出路径参数2

  constructor(currentNode: JsonTreeModel, rootNode: JsonTreeModel[]) {
    this.title = '规则';
    this.whereExpression = new WhereExpression();
    this.keySelectType = Constant.CONST_KEY_SELECT_TYPE.CURRENT_NODE;
    this.nodeKeyExpression = currentNode?.code;
    this.nodeKeyExpressionParam1 = '0';
    this.nodeKeyExpressionParam2 = '';
    this.outputKeyOrValueType = [Constant.CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE];
    this.outputKeys = [Constant.CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT];
    this.outputKeysExpressions = [];
    this.outputValuesExpressions = [new OutputValueExpression(currentNode, rootNode)];
    this.outputConstValuesExpressions = [];
    this.outputPathExpression = '';
    this.outputPathType = Constant.CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT;
    this.outputPathExpressionParam1 = '';
    this.outputPathExpressionParam2 = '';
  }
}

export class OutputPathExpression implements IBaseOutputPathExpression {
  outputPathType: string;
  outputPathExpression: string = '';
  _outputPathExpressionPre: string = '';
  _outputPathExpressionParam1: string = '';
  _outputPathExpressionParam1Node?: JsonTreeModel;
  _outputPathExpressionParam2: string = '';
  _outputPathExpressionSuf: string = '';
  _outputPathIsContainUpperNode: boolean = true;

  constructor(private _currentNode: JsonTreeModel, private _rootNode: JsonTreeModel[]) {
    this.outputPathType = Constant.CONST_OUTPUT_PATH_TYPE.DIRECT_INPUT;
    this.buildOutputPathExpression();
  }

  get outputPathIsContainUpperNode(): boolean {
    return this._outputPathIsContainUpperNode;
  }

  set outputPathIsContainUpperNode(value: boolean) {
    this._outputPathIsContainUpperNode = value;
    this.buildOutputPathExpression();
  }

  get outputPathExpressionParam1Node(): undefined | JsonTreeModel {
    return this._outputPathExpressionParam1Node;
  }
  set outputPathExpressionParam1Node(value: JsonTreeModel | undefined) {
    this._outputPathExpressionParam1Node = value;
    this.buildOutputPathExpression();
  }

  get currentNode(): JsonTreeModel {
    return this._currentNode;
  }
  set currentNode(value: JsonTreeModel) {
    this._currentNode = value;
    this.buildOutputPathExpression();
  }

  get rootNode(): JsonTreeModel[] {
    return this._rootNode;
  }
  set rootNode(value: JsonTreeModel[]) {
    this._rootNode = value;
    this.buildOutputPathExpression();
  }

  get outputPathExpressionPre(): string | undefined {
    return this._outputPathExpressionPre;
  }
  set outputPathExpressionPre(value: string) {
    this._outputPathExpressionPre = value;
    this.buildOutputPathExpression();
  }

  get outputPathExpressionParam1(): string | undefined {
    return this._outputPathExpressionParam1;
  }
  set outputPathExpressionParam1(value: string) {
    this._outputPathExpressionParam1 = value;
    this.buildOutputPathExpression();
  }

  get outputPathExpressionParam2(): string | undefined {
    return this._outputPathExpressionParam2;
  }
  set outputPathExpressionParam2(value: string) {
    this._outputPathExpressionParam2 = value;
    this.buildOutputPathExpression();
  }

  get outputPathExpressionSuf(): string | undefined {
    return this._outputPathExpressionSuf;
  }
  set outputPathExpressionSuf(value: string) {
    this._outputPathExpressionSuf = value;
    this.buildOutputPathExpression();
  }

  buildOutputPathExpression() {
    debugger;
    let upperCode = '';
    if (this._currentNode && this._rootNode) {
      this.getAncestor();
      if (this.outputPathIsContainUpperNode && this.outputPathExpressionParam1Node?.id) {
        upperCode = getCodePathById(this.outputPathExpressionParam1Node?.id, this.rootNode);
        // upperCode = replaceSpecialCharacters(upperCode);
      }
    }
    const pre = this.outputPathExpressionPre;
    const param1 = this.outputPathExpressionParam1;
    const param2 = this.outputPathExpressionParam2;
    const suf = this.outputPathExpressionSuf;

    if (this.outputPathType === Constant.CONST_OUTPUT_PATH_TYPE.BY_KEY) {
      if (!param1 && !param2) {
        this.outputPathExpression = `${pre}${upperCode}&${suf}`;
      } else if (param2) {
        this.outputPathExpression = `${pre}${upperCode}&(${param1},${param2})${suf}`;
      } else {
        this.outputPathExpression = `${pre}${upperCode}&(${param1})${suf}`;
      }
    } else if (this.outputPathType === Constant.CONST_OUTPUT_PATH_TYPE.BY_PROP) {
      if (!param1 && !param2) {
        this.outputPathExpression = `${pre}${upperCode}@${suf}`;
      } else if (param2) {
        this.outputPathExpression = `${pre}${upperCode}@(${param1},${param2})${suf}`;
      } else {
        this.outputPathExpression = `${pre}${upperCode}@(${param1})${suf}`;
      }
    } else {
      this.outputPathExpression = '';
    }
  }

  /**
   * 向上查找节点
   * @param root   整棵树（根节点数组）
   * @param node   起始节点
   * @param level  向上几级（必须为正整数）
   * @returns      对应的祖先节点；若不存在则返回 undefined
   */
  getAncestor(): JsonTreeModel | undefined {
    try {
      const level = parseInt(this._outputPathExpressionParam1) - 1;
      if (level <= 0) {
        this._outputPathExpressionParam1Node = this._currentNode;
        return this._currentNode;
      }
      // 1. 建立 id -> node 的索引表
      const idMap = new Map<string, JsonTreeModel>();
      function dfs(arr: JsonTreeModel[]) {
        for (const n of arr) {
          idMap.set(n.id, n);
          if (n.children?.length) dfs(n.children);
        }
      }
      dfs(this._rootNode);

      // 2. 逐层向上跳
      let currentId = this._currentNode.id;
      for (let i = 0; i < level; i++) {
        // 去掉最后一段 "-x"
        const lastDash = currentId.lastIndexOf('-');
        if (lastDash === -1) return undefined; // 已到达根节点
        currentId = currentId.slice(0, lastDash);
      }
      this._outputPathExpressionParam1Node = idMap.get(currentId) || undefined;
      return this.outputPathExpressionParam1Node;
    } catch (error) {
      return undefined;
    }
  }
}

export class OutputKeyExpression extends OutputPathExpression implements IOutputKeyExpression {
  outputKeyExpression: string = '';
  _outputKeyExpressionParam1: string;
  _outputKeyExpressionParam2: string;
  constructor(_currentNode: JsonTreeModel, _rootNode: JsonTreeModel[], outputKeyExpressionParam1?: string, outputKeyExpressionParam2?: string) {
    super(_currentNode, _rootNode);
    this._outputKeyExpressionParam1 = outputKeyExpressionParam1 || Constant.CONST_OUTPUT_KEY_PARAM1_TYPE.CURRENT_KEY;
    this._outputKeyExpressionParam2 = outputKeyExpressionParam2 || '';
    this.buildOutputKeyExpression();
  }

  get outputKeyExpressionParam1(): string {
    // 可以在这里加日志、缓存等
    return this._outputKeyExpressionParam1;
  }

  set outputKeyExpressionParam1(newVal: string) {
    const t = newVal.trim();
    this._outputKeyExpressionParam1 = t;
    this.buildOutputKeyExpression();
  }

  get outputKeyExpressionParam2(): string | undefined {
    // 可以在这里加日志、缓存等
    return this._outputKeyExpressionParam2;
  }

  set outputKeyExpressionParam2(newVal: string) {
    const t = newVal.trim();
    this._outputKeyExpressionParam2 = t;
    this.buildOutputKeyExpression();
  }

  buildOutputKeyExpression() {
    if (this.outputKeyExpressionParam1 === Constant.CONST_OUTPUT_KEY_PARAM1_TYPE.CURRENT_KEY) {
      this.outputKeyExpression = '$';
    }
    this.outputKeyExpression = build$(this.outputKeyExpressionParam1, this.outputKeyExpressionParam2);
  }
}

export class OutputValueExpression extends OutputPathExpression implements IOutputValueExpression {
  constructor(_currentNode: JsonTreeModel, _rootNode: JsonTreeModel[]) {
    super(_currentNode, _rootNode);
  }
}

export class OutputConstValueExpression extends OutputPathExpression implements IOutputConstValueExpression {
  outputConstValue: string;
  constructor(_currentNode: JsonTreeModel, _rootNode: JsonTreeModel[]) {
    super(_currentNode, _rootNode);
    this.outputConstValue = '';
  }
}

export class WhereExpression implements IWhereExpression {}
