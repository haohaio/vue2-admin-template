<template>
  <el-dialog class="dialog" :title="title" :visible.sync="dialogVisible" :width="`${width}px`" v-bind="$attrs" v-on="$listeners" :close-on-click-modal="false">
    <span class="dialog-title">{{content}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    content: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 314
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
    },
    close() {
      this.dialogVisible = false
    },
    handleConfirm() {
      this.$emit('confirm')
      this.dialogVisible = false
    }
  }
}
</script>
