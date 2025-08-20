type NodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

import { JsonTreeModel } from '@/utils/model/jsonModel';
import { CONST_KEY_SELECT_TYPE, CONST_OUTPUT_KEY_OR_VALUE_TYPE } from './constant';

export function jsonToTree(data: any): JsonTreeModel[] {
  function buildTree(obj: any, parentId: string = ''): JsonTreeModel[] {
    const nodes: JsonTreeModel[] = [];
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      // 如果是对象
      let index = 1;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          const nodeId = `${parentId}${index++}`;
          const node: JsonTreeModel = {
            id: nodeId,
            code: key,
            name: key,
            spec: undefined,
            type: typeof value,
          };
          if (typeof value === 'object' && value !== null) {
            // 如果值是对象或数组，递归处理
            node.children = buildTree(value, `${nodeId}-`);
          } else {
            // 如果值是叶子节点
            node.value = value;
          }
          nodes.push(node);
        }
      }
    } else if (Array.isArray(obj)) {
      // 如果是数组
      obj.forEach((item: any, index: number) => {
        const nodeName = `item_${index}`;
        const nodeId = `${parentId}${index + 1}`;
        const node: JsonTreeModel = {
          id: nodeId,
          code: nodeName,
          name: nodeName,
          type: 'array',
          spec: undefined,
          index: index, // 添加index属性
        };
        if (typeof item === 'object' && item !== null) {
          // 如果数组元素是对象或数组，递归处理
          node.children = buildTree(item, `${nodeId}-`);
        } else {
          // 如果数组元素是叶子节点
          node.value = item;
        }
        nodes.push(node);
      });
    } else {
      // 如果是叶子节点
      const leafNode: JsonTreeModel = {
        id: `${parentId}1`,
        code: 'value',
        name: data.toString(),
        type: typeof data,
        spec: undefined,
        value: data,
      };
      nodes.push(leafNode);
    }
    return nodes;
  }

  // 根节点的处理
  if (typeof data === 'object' && data !== null) {
    return buildTree(data);
  } else {
    return [
      {
        id: '1',
        code: 'value',
        name: data.toString(),
        type: typeof data,
        spec: undefined,
        value: data,
      },
    ];
  }
}

export function buildSpec(nodes: JsonTreeModel[]) {
  const spec: any = [
    {
      operation: 'shift',
      spec: {},
    },
  ];
  const json = treeToSpecJson(nodes);
  spec[0].spec = json;
  return spec;
}
export function treeToSpecJson(nodes: JsonTreeModel[]): any {
  const result: any = {};

  nodes.forEach((node) => {
    // 如果有子节点，递归处理
    if (node.children && node.children.length > 0) {
      //如果匹配了规则
      if (node.spec) {
        //如果输出的包含key
        result[node.spec.nodeKeyExpression] = {};
        const isOutputKeyOrValueContainKey = node.spec.outputKeyOrValueType.includes(
          CONST_OUTPUT_KEY_OR_VALUE_TYPE.KEY,
        );
        const isOutputKeyOrValueContainValue = node.spec.outputKeyOrValueType.includes(
          CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE,
        );
        const isOutputKeyOrValueContainsConstValue = node.spec.outputKeyOrValueType.includes(
          CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE,
        );
        if (isOutputKeyOrValueContainKey) {
          for (let i = 0; i < node.spec.outputKeysExpressions.length; i++) {
            const outputExpres = node.spec.outputKeysExpressions[i];
            if (outputExpres.outputPathExpression) {
              result[node.spec.nodeKeyExpression][
                `$(${outputExpres.outputKeyExpressionParam1},${outputExpres.outputKeyExpressionParam2})`
              ] = outputExpres.outputPathExpression;
            } else {
              result[node.spec.nodeKeyExpression] = treeToSpecJson(node.children);
            }
          }
        }
        //如果输出的包含Value
        if (isOutputKeyOrValueContainValue) {
          for (let i = 0; i < node.spec.outputValuesExpressions.length; i++) {
            const outputExpres = node.spec.outputValuesExpressions[i];
            if (outputExpres.outputPathExpression) {
              result[node.spec.nodeKeyExpression][`@`] = outputExpres.outputPathExpression;
            } else {
              result[node.spec.nodeKeyExpression] = treeToSpecJson(node.children);
            }
          }
        }
        // else {
        //   result[node.spec.nodeKeyExpression] = {
        //     $: node.spec.outputPathExpression,
        //   };
        // }
        //如果输出的包含特定字符串
        if (isOutputKeyOrValueContainsConstValue) {
          debugger;
          for (let i = 0; i < node.spec.outputConstValuesExpressions.length; i++) {
            const outputExpres = node.spec.outputConstValuesExpressions[i];
            if (outputExpres.outputPathExpression && outputExpres.outputConstValue) {
              result[node.spec.nodeKeyExpression][`#${outputExpres.outputConstValue}`] =
                outputExpres.outputPathExpression;
            } else {
              result[node.spec.nodeKeyExpression] = treeToSpecJson(node.children);
            }
          }
        }

        //如果都不包含
        if (!isOutputKeyOrValueContainKey && !isOutputKeyOrValueContainValue && !isOutputKeyOrValueContainsConstValue) {
          result[node.spec.nodeKeyExpression] = treeToSpecJson(node.children);
        }

        // else {
        //   result[node.spec.nodeKeyExpression] = {
        //     $: node.spec.outputPathExpression,
        //   };
        // }
      } else {
        const rel = treeToSpecJson(node.children);
        if (Object.keys(rel).length > 0) {
          result[node.code] = rel;
        }
      }
    } else {
      // 如果是叶子节点，直接使用value作为值
      if (node.spec) {
        result[node.spec.nodeKeyExpression] = {};
        const isOutputKeyOrValueContainKey = node.spec.outputKeyOrValueType.includes(
          CONST_OUTPUT_KEY_OR_VALUE_TYPE.KEY,
        );
        const isOutputKeyOrValueContainValue = node.spec.outputKeyOrValueType.includes(
          CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE,
        );
        const isOutputKeyOrValueContainsConstValue = node.spec.outputKeyOrValueType.includes(
          CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE,
        );
        //如果输出的包含key
        if (isOutputKeyOrValueContainKey) {
          for (let i = 0; i < node.spec.outputKeysExpressions.length; i++) {
            const outputExpres = node.spec.outputKeysExpressions[i];
            result[node.spec.nodeKeyExpression][
              `$(${outputExpres.outputKeyExpressionParam1},${outputExpres.outputKeyExpressionParam2})`
            ] = outputExpres.outputPathExpression;
          }
        }
        //如果输出的包含Value
        if (isOutputKeyOrValueContainValue) {
          for (let i = 0; i < node.spec.outputValuesExpressions.length; i++) {
            const outputExpres = node.spec.outputValuesExpressions[i];
            result[node.spec.nodeKeyExpression][`@`] = outputExpres.outputPathExpression;
          }
        }

        //如果输出的包含特定字符串
        if (isOutputKeyOrValueContainsConstValue) {
          for (let i = 0; i < node.spec.outputConstValuesExpressions.length; i++) {
            const outputExpres = node.spec.outputConstValuesExpressions[i];
            if (outputExpres.outputPathExpression && outputExpres.outputConstValue) {
              result[node.spec.nodeKeyExpression][`#${outputExpres.outputConstValue}`] =
                outputExpres.outputPathExpression;
            }
          }
        }
      }
    }

    //如果选择的是上级节点，则需要嵌套一层
    if (node.spec?.keySelectType == CONST_KEY_SELECT_TYPE.UPPER_NODE) {
      if (node.spec != null) {
        result[node.code] = {
          [node.spec.nodeKeyExpression]: result[node.spec.nodeKeyExpression],
        };
        delete result[node.spec.nodeKeyExpression];
      } else {
        result[node.code] = {
          [node.code]: result[node.code],
        };
      }
    }
  });

  return result;
}

export function mergeJsonWithSpec(json1: string, json2: string): any {
  const j1 = JSON.parse(json1);
  const j2 = JSON.parse(json2);

  /**
   * 在遍历 j1 时，需要知道「当前层级」在 j2 中对应的节点，
   * 以便判断同层级是否有 code 相同的对象。
   */
  function walk(a: any, b: any): any {
    // 1. 基本类型 / null —— 直接返回
    if (typeof a !== 'object' || a === null) return a;

    // 2. 数组 —— 递归每个元素，b 也按数组处理
    if (Array.isArray(a)) {
      return a.map((item, idx) => walk(item, Array.isArray(b) ? b[idx] : undefined));
    }

    // 3. 普通对象
    const res = { ...a };

    // 3.1 如果当前对象有 code，且 b 也是对象且有相同 code，则拿 spec
    if (
      'code' in res &&
      typeof b === 'object' &&
      !Array.isArray(b) &&
      b !== null &&
      b.code === res.code &&
      'spec' in b
    ) {
      res.spec = b.spec;
    }

    // 3.2 对子节点递归
    for (const [k, v] of Object.entries(res)) {
      res[k] = walk(v, b?.[k]);
    }

    return res;
  }

  return walk(j1, j2);
}

/**
 * 向上查找节点
 * @param root   整棵树（根节点数组）
 * @param node   起始节点
 * @param level  向上几级（必须为正整数）
 * @returns      对应的祖先节点；若不存在则返回 undefined
 */
export function getAncestor(root: JsonTreeModel[], node: JsonTreeModel, level: number): JsonTreeModel | undefined {
  if (level <= 0) return node;

  // 1. 建立 id -> node 的索引表
  const idMap = new Map<string, JsonTreeModel>();
  function dfs(arr: JsonTreeModel[]) {
    for (const n of arr) {
      idMap.set(n.id, n);
      if (n.children?.length) dfs(n.children);
    }
  }
  dfs(root);

  // 2. 逐层向上跳
  let currentId = node.id;
  for (let i = 0; i < level; i++) {
    // 去掉最后一段 "-x"
    const lastDash = currentId.lastIndexOf('-');
    if (lastDash === -1) return undefined; // 已到达根节点
    currentId = currentId.slice(0, lastDash);
  }
  return idMap.get(currentId);
}
