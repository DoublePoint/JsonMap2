<template>
  <div>
    <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>
      <el-table-column prop="id" label="ID" sortable />
      <el-table-column prop="name" label="Name" sortable />
      <el-table-column prop="type" label="值类型" sortable />
      <el-table-column prop="value" label="值" sortable />
    </el-table>
  </div>
</template>

<script lang="ts" setup>

const tableData = ref<User[]>([])

interface User {
  id: number
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}
const props = defineProps({
  data: {
    type: Array<User>,
    default: () => new Array<User>()
  }
})

onMounted(() => {
  console.log(props.data);

  tableData.value = props.data;
  console.log(`the component is now mounted.`)
})
watch(() => props.data, (newVal: Array<User>, oldVal: Array<User>) => {
  tableData.value = props.data;
  // 在这里执行需要的逻辑
});

const load = (
  row: User,
  treeNode: unknown,
  resolve: (data: User[]) => void
) => {
  setTimeout(() => {
    resolve([
      {
        id: 31,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ])
  }, 1000)
}

// const tableData: User[] = [
//   {
//     id: 1,
//     date: '2016-05-02',
//     name: 'wangxiaohu',
//     address: 'No. 189, Grove St, Los Angeles',
//   },
//   {
//     id: 2,
//     date: '2016-05-04',
//     name: 'wangxiaohu',
//     address: 'No. 189, Grove St, Los Angeles',
//   },
//   {
//     id: 3,
//     date: '2016-05-01',
//     name: 'wangxiaohu',
//     address: 'No. 189, Grove St, Los Angeles',
//     children: [
//       {
//         id: 31,
//         date: '2016-05-01',
//         name: 'wangxiaohu',
//         address: 'No. 189, Grove St, Los Angeles',
//       },
//       {
//         id: 32,
//         date: '2016-05-01',
//         name: 'wangxiaohu',
//         address: 'No. 189, Grove St, Los Angeles',
//       },
//     ],
//   },
//   {
//     id: 4,
//     date: '2016-05-03',
//     name: 'wangxiaohu',
//     address: 'No. 189, Grove St, Los Angeles',
//   },
// ]
</script>
