<template>
  <div class="doublesNum">
    <el-input-number @input="startChange" class="el-form" :value="value[0]" :placeholder="placeholder[0]" :precision="precision" :controls="false" :max="max" :min="min" size="small" clearable></el-input-number>
    <div class="doublesText-line">-</div>
    <el-input-number @input="endChange" class="el-form" :value="value[1]" :placeholder="placeholder[1]" :precision="precision" :controls="false" :max="max" :min="min" size="small" clearable></el-input-number>
  </div>
</template>

<script>
export default {
  name: 'doubles-num',
  model: {
    event: 'input',
    prop: 'value'
  },
  props: {
    value: {
      type: Array,
      default: function() {
        return new Array(2)
      }
    },
    placeholder: {
      type: Array,
      default: function() {
        return ['最小值', '最大值']
      }
    },
    precision: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    }
  },
  methods: {
    startChange(val) {
      const value = [...this.value]
      value[0] = val
      this.$emit('input', value)
    },
    endChange(val) {
      const value = [...this.value]
      value[1] = val
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped lang="scss">
.doublesNum {
  display: flex;

  .doublesText-line {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 32px;
  }

  .el-form {
    width: 180px;
  }
}
</style>
