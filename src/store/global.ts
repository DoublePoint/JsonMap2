import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  const inputJson = ref({});
  const specTreeNode = ref([]);

  const updateInputJson = (data: any) => {
    inputJson.value = data;
  };

  const updateSpecTreeNode = (node: any) => {
    specTreeNode.value = node;
  };

  return { inputJson, specTreeNode, updateInputJson, updateSpecTreeNode };
});
