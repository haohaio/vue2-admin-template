<template>
  <el-pagination class="mv-pagination" background layout="total, sizes, prev, pager, next, jumper" :page-size="pageData.pageSize" :current-page="pageData.pageNum" :page-sizes="[10, 20, 50]" :total="pageData.total" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
</template>

<script>
export default {
  name: 'MvPagination',
  props: {
    pageData: {
      type: Object,
      default: () => {
        return {
          pageNum: 1,
          pageSize: 10,
          total: 0
        }
      }
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.$emit('current-change', page)
    },
    handleSizeChange(pageSize) {
      this.$emit('size-change', pageSize)
    },
  }
}
</script>
<style  lang="scss" scoped>
.mv-pagination {
  // margin-top: 20px;
  background-color: #fff;
  text-align: right;
  padding: 20px;
}
</style>
