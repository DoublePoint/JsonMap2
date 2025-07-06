export interface TreeNode {
  id: string;
  code: string;
  name: string;
  type: string;
  value?: any;
  children?: TreeNode[];
  index?: number; // 仅在数组元素中使用
}
