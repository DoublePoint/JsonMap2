type NodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

import { TreeNode } from '@/utils/model/jsonModel';

export default function jsonToTree(data: any): TreeNode[] {
  function buildTree(obj: any, parentId: string = ''): TreeNode[] {
    const nodes: TreeNode[] = [];
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      // 如果是对象
      let index = 1;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          const nodeId = `${parentId}${index++}`;
          const node: TreeNode = {
            id: nodeId,
            code: key,
            name: key,
            type: typeof value
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
        const node: TreeNode = {
          id: nodeId,
          code: nodeName,
          name: nodeName,
          type: 'array',
          index: index // 添加index属性
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
      const leafNode: TreeNode = {
        id: `${parentId}1`,
        code: 'value',
        name: data.toString(),
        type: typeof data,
        value: data
      };
      nodes.push(leafNode);
    }
    return nodes;
  }

  // 根节点的处理
  if (typeof data === 'object' && data !== null) {
    return buildTree(data);
  } else {
    return [{
      id: '1',
      code: 'value',
      name: data.toString(),
      type: typeof data,
      value: data
    }];
  }
}
