type NodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

import { JsonTreeModel } from '@/utils/model/jsonModel';
import { CONST_KEY_SELECT_TYPE, CONST_OUTPUT_KEY_OR_VALUE_TYPE } from './constant';
import exp from 'constants';

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
        node.spec.specList.forEach((specDetail) => {
          const isOutputKeyOrValueContainKey = specDetail.outputKeyOrValueType.includes(CONST_OUTPUT_KEY_OR_VALUE_TYPE.KEY) && specDetail.outputKeysExpressions[0].outputPathExpression;
          const isOutputKeyOrValueContainValue = specDetail.outputKeyOrValueType.includes(CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE) && specDetail.outputValuesExpressions[0].outputPathExpression;
          const isOutputKeyOrValueContainsConstValue =
            specDetail.outputKeyOrValueType.includes(CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE) && specDetail.outputConstValuesExpressions[0].outputPathExpression;
          if (isOutputKeyOrValueContainKey) {
            for (let i = 0; i < specDetail.outputKeysExpressions.length; i++) {
              const outputExpres = specDetail.outputKeysExpressions[i];
              if (outputExpres.outputPathExpression) {
                setByPath(result, [specDetail.nodeKeyExpression, build$(outputExpres.outputKeyExpressionParam1, outputExpres.outputKeyExpressionParam2)], outputExpres.outputPathExpression);
              }
            }
          }
          //如果输出的包含key
          //如果输出的包含Value
          if (isOutputKeyOrValueContainValue) {
            for (let i = 0; i < specDetail.outputValuesExpressions.length; i++) {
              const outputExpres = specDetail.outputValuesExpressions[i];
              if (outputExpres.outputPathExpression) {
                setByPath(result, [specDetail.nodeKeyExpression, `@`], outputExpres.outputPathExpression);
              }
            }
          }

          const constValueResult: any = {};
          //如果输出的包含特定字符串
          if (isOutputKeyOrValueContainsConstValue) {
            for (let i = 0; i < specDetail.outputConstValuesExpressions.length; i++) {
              const outputExpres = specDetail.outputConstValuesExpressions[i];
              if (outputExpres.outputPathExpression && outputExpres.outputConstValue) {
                setByPath(constValueResult, [`#${outputExpres.outputConstValue}`], outputExpres.outputPathExpression);
                // setByPath(result, [specDetail.nodeKeyExpression, `#${outputExpres.outputConstValue}`], outputExpres.outputPathExpression);
              }
            }
          }

          // 如果都不包含;
          if (!isOutputKeyOrValueContainKey && !isOutputKeyOrValueContainValue && !isOutputKeyOrValueContainsConstValue) {
            result[specDetail.nodeKeyExpression] = treeToSpecJson(node.children!);
          }
          const rel = treeToSpecJson(node.children!);
          Object.keys(rel).forEach((key) => {
            if (!result[specDetail.nodeKeyExpression]) {
              result[specDetail.nodeKeyExpression] = {};
            }
            result[specDetail.nodeKeyExpression][key] = rel[key];
          });
          if (specDetail.whereExpression?.whereExpression) {
            // if (isOutputKeyOrValueContainsConstValue) {
            // setByPath(result, [node.code, `#${outputExpres.outputConstValue}`], rel);
            // } else {
            setByPath(result, [replaceSpecialCharacters(node.code), specDetail.nodeKeyExpression], result[specDetail.nodeKeyExpression]);
            // }
            delete result[specDetail.nodeKeyExpression];
          }
        });

        // if (Object.keys(rel).length > 0) {
        // result[node.code] = rel;
        // }
      } else {
        const rel = treeToSpecJson(node.children);
        if (Object.keys(rel).length > 0) {
          result[replaceSpecialCharacters(node.code)] = rel;
        }
      }
    } else {
      // 如果是叶子节点，直接使用value作为值
      if (node.spec) {
        node.spec.specList.forEach((specDetail) => {
          const isOutputKeyOrValueContainKey = specDetail.outputKeyOrValueType.includes(CONST_OUTPUT_KEY_OR_VALUE_TYPE.KEY) && specDetail.outputKeysExpressions[0].outputPathExpression;
          const isOutputKeyOrValueContainValue = specDetail.outputKeyOrValueType.includes(CONST_OUTPUT_KEY_OR_VALUE_TYPE.VALUE) && specDetail.outputValuesExpressions[0].outputPathExpression;
          const isOutputKeyOrValueContainsConstValue =
            specDetail.outputKeyOrValueType.includes(CONST_OUTPUT_KEY_OR_VALUE_TYPE.CONST_VALUE) && specDetail.outputConstValuesExpressions[0].outputPathExpression;
          //如果输出的包含key
          if (isOutputKeyOrValueContainKey) {
            for (let i = 0; i < specDetail.outputKeysExpressions.length; i++) {
              const outputExpres = specDetail.outputKeysExpressions[i];
              setByPath(result, [specDetail.nodeKeyExpression, build$(outputExpres.outputKeyExpressionParam1, outputExpres.outputKeyExpressionParam2)], outputExpres.outputPathExpression);
            }
          }
          //如果输出的包含Value
          if (isOutputKeyOrValueContainValue) {
            for (let i = 0; i < specDetail.outputValuesExpressions.length; i++) {
              const outputExpres = specDetail.outputValuesExpressions[i];
              setByPath(result, [specDetail.nodeKeyExpression, `@`], outputExpres.outputPathExpression);
            }
          }

          const constValueResult: any = {};
          //如果输出的包含特定字符串
          if (isOutputKeyOrValueContainsConstValue) {
            for (let i = 0; i < specDetail.outputConstValuesExpressions.length; i++) {
              const outputExpres = specDetail.outputConstValuesExpressions[i];
              if (outputExpres.outputPathExpression && outputExpres.outputConstValue) {
                setByPath(constValueResult, [`#${outputExpres.outputConstValue}`], outputExpres.outputPathExpression);
                // result[specDetail.nodeKeyExpression][`#${outputExpres.outputConstValue}`] = outputExpres.outputPathExpression;
              }
            }
          }

          if (specDetail.whereExpression?.whereExpression) {
            if (result[specDetail.nodeKeyExpression]) {
              let expression = JSON.parse(JSON.stringify(result[specDetail.nodeKeyExpression]));
              delete result[specDetail.nodeKeyExpression];
              if (node.type === 'array') {
                setByPath(result, ['*', specDetail.whereExpression.whereExpression, specDetail.nodeKeyExpression], expression);
              } else {
                setByPath(result, [replaceSpecialCharacters(node.code), specDetail.whereExpression.whereExpression, specDetail.nodeKeyExpression], expression);
              }
            } else {
              setByPath(result, [replaceSpecialCharacters(node.code), specDetail.whereExpression.whereExpression], {});
              assignProps(result[replaceSpecialCharacters(node.code)][specDetail.whereExpression.whereExpression], constValueResult);
            }
          }
        });
      }
    }
  });

  return result;
}
/**
 * 把源对象 src 的所有（可枚举）属性拷贝到已有目标对象 target
 * @param target  已有对象（Class 实例也行）
 * @param src     待拷贝的 plain object / 类实例
 * @param deep    是否递归深拷贝（默认 true）
 * @param ignore  忽略的 key 列表（默认 []）
 */
export function assignProps<T extends object>(target: T, src: Partial<T>, deep = true, ignore: (keyof T)[] = []): T {
  if (!src || typeof src !== 'object') return target;

  // Reflect.ownKeys 能拿到 symbol key；Object.keys 只能拿到 string
  const keys = Reflect.ownKeys(src) as Array<keyof T>;

  for (const key of keys) {
    if (ignore.includes(key)) continue;

    const srcVal = src[key];
    const tgtVal = target[key];

    if (deep && isPlainObject(srcVal) && isPlainObject(tgtVal)) {
      // 都是 plain object → 递归
      assignProps(tgtVal, srcVal as any, true, []);
    } else if (deep && Array.isArray(srcVal) && Array.isArray(tgtVal)) {
      // 都是数组 → 逐项递归
      tgtVal.splice(0, tgtVal.length, ...srcVal);
    } else {
      // 其余情况直接覆盖
      (target as any)[key] = srcVal;
    }
  }
  return target;
}

/* 工具：判断是否为纯对象（排除 null、数组、函数、Date 等） */
function isPlainObject(item: any): item is Record<string, any> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function build$(param1: string, param2?: string) {
  if (!param1) {
    return `$(error)`;
  }
  if (param2) {
    return `$(${param1},${param2})`;
  } else {
    return `$${param1}`;
  }
}
/**
 * 根据路径强制设置对象属性，不关心最后一层的对象数据是否是空
 * @param obj
 * @param keys
 * @param value
 */
export function setByPathForce(obj: any, keys: string[], value: any) {
  let cur = obj;
  const last = keys.length - 1;
  for (let i = 0; i < last; i++) {
    const k = keys[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[keys[last]] = value;
}
/**
 * 根据路径设置对象属性
 * @param obj
 * @param keys
 * @param value
 */
export function setByPath(obj: any, keys: string[], value: any) {
  let cur = obj;
  const last = keys.length - 1;
  for (let i = 0; i < last; i++) {
    const k = keys[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  if (!cur[keys[last]]) {
    if (value.constructor === String) {
      value = value.replace('\\\\', '\\');
    }
    cur[keys[last]] = value;
  }
}
// 使用
// const data: any = {};                 // 初始完全空
// setByPath(data, ['a1', 'b1', 'c1'], 'hello');
// console.log(data); // { a1: { b1: { c1: 'hello' } } }
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
    if ('code' in res && typeof b === 'object' && !Array.isArray(b) && b !== null && b.code === res.code && 'spec' in b) {
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

/**
 * 获取节点的所有祖先节点（包括当前节点）
 * @param root   整棵树（根节点数组）
 * @param node   起始节点
 * @returns      节点数组，索引为向上层级数（当前节点层级为0），值为对应的节点对象
 */
export function getAncestors(root: JsonTreeModel[], node: JsonTreeModel): JsonTreeModel[] {
  const ancestors: JsonTreeModel[] = [];

  // 如果节点id无效，直接返回空数组
  if (!node.id) {
    return ancestors;
  }

  // 1. 建立 id -> node 的索引表
  const idMap = new Map<string, JsonTreeModel>();
  function dfs(arr: JsonTreeModel[]) {
    for (const n of arr) {
      idMap.set(n.id, n);
      if (n.children?.length) dfs(n.children);
    }
  }
  dfs(root);

  // 2. 收集所有祖先节点ID（包括当前节点）
  const nodeInfos: { id: string; node: JsonTreeModel; level: number }[] = [];
  let currentId = node.id;
  let currentNode = node;
  let level = 0;

  // 先添加当前节点
  nodeInfos.push({ id: currentId, node: currentNode, level: level });

  // 然后逐级向上收集祖先节点
  while (true) {
    // 去掉最后一段 "-x"
    const lastDash = currentId.lastIndexOf('-');
    if (lastDash === -1) break; // 已到达根节点

    currentId = currentId.slice(0, lastDash);
    const ancestorNode = idMap.get(currentId);
    if (ancestorNode) {
      level++;
      nodeInfos.push({ id: currentId, node: ancestorNode, level: level });
    }
  }

  // 3. 按层级顺序填充祖先数组（索引为向上层级数）
  for (let i = nodeInfos.length - 1; i >= 0; i--) {
    const nodeInfo = nodeInfos[i];
    ancestors[nodeInfo.level] = nodeInfo.node;
  }

  return ancestors;
}

export function replaceSpecialCharacters(str: string): string {
  if (!str) {
    return '';
  }
  return str.replaceAll('@', '\\@').replaceAll('$', '\\$').replaceAll('#', '\\#').replaceAll('&', '\\&');
}

/**
 * 获取当前节点所有祖先的 code 路径
 * @param currentNode 当前节点
 * @param root        整棵树（根节点数组）
 * @returns           形如 "code1.code2.code3" 的字符串；无祖先则返回空串
 */
export function getCodePath(currentNode: JsonTreeModel, root: JsonTreeModel[]): string {
  if (!currentNode) return '';

  /* ---------- 1. 建立 id -> node 的索引 ---------- */
  const idMap = new Map<string, JsonTreeModel>();
  function dfs(nodes: JsonTreeModel[]) {
    nodes.forEach((n) => {
      idMap.set(n.id, n);
      if (n.children?.length) dfs(n.children);
    });
  }
  dfs(root);

  /* ---------- 2. 逐级向上收集 code ---------- */
  const codes: string[] = [];
  let id = currentNode.id;

  // 不断去掉最后一段 "-x" 就能拿到父 id
  while (true) {
    const lastDash = id.lastIndexOf('-');
    if (lastDash === -1) break; // 已到根节点
    id = id.slice(0, lastDash);
    const ancestor = idMap.get(id);
    if (ancestor) codes.unshift(ancestor.code);
  }

  return codes.join('.');
}

/**
 * 根据节点 id 获取其所有祖先的 code 路径
 * @param id   当前节点 id
 * @param root 整棵树（根节点数组）
 * @returns    形如 "code1.code2.code3" 的字符串；未找到节点或无祖先则返回空串
 */
export function getCodePathById(id: string, root: JsonTreeModel[]): string {
  if (!id) return '';

  /* ---------- 1. 建立 id -> node 的索引 ---------- */
  const idMap = new Map<string, JsonTreeModel>();
  function dfs(nodes: JsonTreeModel[]) {
    nodes.forEach((n) => {
      idMap.set(n.id, n);
      if (n.children?.length) dfs(n.children);
    });
  }
  dfs(root);

  /* ---------- 2. 逐级向上收集 code ---------- */
  const codes: string[] = [];
  let curId = id;

  // 不断去掉最后一段 "-x" 就能拿到父 id
  while (true) {
    const lastDash = curId.lastIndexOf('-');
    if (lastDash === -1) break; // 已到达根节点
    curId = curId.slice(0, lastDash);
    const ancestor = idMap.get(curId);
    if (ancestor) codes.unshift(ancestor.code);
  }

  if (codes.length != 0) {
    return codes.join('.') + '.';
  }
  return '';
}
