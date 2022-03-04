<template>
  <div class="topBar">
    <div v-if="isMount" ref="wrap" class="topBar-wrapper" :style="{height:formHeight+'px'}">
      <template v-for="(form,index) in initFormData">
        <div class="topBar-form" v-if="form.show" :key="index">
          <div v-if="form" class="topBar-form-label" :style="{width:labelWidth+'px'}">
            <span class="topBar-form-require" v-if="form.require">*</span>
            {{form.label+"："}}
          </div>
          <dynamic-cmp ref="dynamic" :key="cmpFormKey(form)" :form="form"></dynamic-cmp>
        </div>
      </template>
      <slot></slot>
    </div>
    <div v-if="isMount" class="topBar-btns">
      <slot name="btnsBefore" :modelValues="modelValues"></slot>
      <el-button class="topBar-btn" type="primary" icon="el-icon-search" size="small" @click="doSearch">查询</el-button>
      <el-button class="topBar-btn" v-if="reset" icon="el-icon-refresh" size="small" @click="doReset">重置</el-button>
      <slot name="btnsAfter" :modelValues="modelValues"></slot>
      <div v-if="showOpen" class="topBar-btn topBar-expand" @click="changeHeight">
        {{!isOpen?'展开':'收起'}}
        <i :class="['el-icon-arrow-down', {retract:isOpen}]"></i>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 事件：@init @search @reset
 * formData数组中的每个对象(form)完整属性：
 * {
 *   label: String(表单名称)
 *   model: String(组件绑定值字段名称)
 *   require: Boolean(是否显示必填星号，默认为false)
 *   component: String(需要渲染的组件名称，默认为'el-input')
 *   modelValue: String(组件进行双向绑定的指定参数，默认为'value')
 *   event: String(组件进行双向绑定的指定事件，默认为'input')
 *   props: Object(对应的具体组件的参数，针对这里面的每一个参数如果是函数的情况，都会自动执行这个函数，支持异步，返回结果用于该参数的值，该函数的回调参数为modelValues、model)
 *   excludeProps: Array(当props里的某个参数是函数的情况，且你不希望自动执行这个函数，可以把该参数名称加入excludeProps)
 *   width: String(定义组件的长度，取值'none'表示不设置宽度，取值'long'表示设置宽度380px，组件默认宽度180px)
 *   watch: Function(监听该组件的值变化，回调参数newValue、oldValue、modelValues和model，该方法必须返回一个Object，表示你需要关联更新的form，会相应的更新这个form，支持异步)
 *   show: 该表单组件是否渲染，默认为true，设为false时不渲染，为false的情况下modelValues内无该model数据，但是initForData有该字段属性，只是不进行渲染
 * }
 *
 * <template v-slot:btns="data">{{data}}</template>
 */
import customSelect from './custom-select.vue'
import doublesNum from './doubles-num.vue'
export default {
  name: 'MiniTopBar',
  props: {
    // 表单模板数据
    formData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否显示重置按钮
    reset: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    // 定义label宽度，单位px
    labelWidth: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      // 数据是否初始化完毕
      isMount: false,
      // 一行表单的高度
      formHeight: 52,
      // 初始化的表单数据
      initFormData: [],
      // 双向绑定数据
      modelValues: {},
      // 是否显示展开图标
      showOpen: false,
      // 是否展开
      isOpen: false,
      // 组件更新标记
      formKeys: {}
    }
  },
  computed: {
    // 动态组件key值
    cmpFormKey() {
      return form => {
        return form.model + this.formKeys[form.model]
      }
    }
  },
  components: {
    // 动态渲染组件
    dynamicCmp: {
      props: ['form'],
      components: {
        customSelect,
        doublesNum
      },
      render(createElement) {
        // props设置
        const props = Object.assign({}, this.form.props)
        // 设置初始值
        props[this.form.modelValue] = this.$parent.modelValues[this.form.model]
        // 设置尺寸为small
        props.size = 'small'
        // 设置clearable默认为true
        props.clearable = props.clearable !== false
        // 针对级联菜单做一些处理
        if (this.form.component === 'el-cascader') {
          // 设置cascader的show-all-levels
          props.showAllLevels = false
          // 设置cascader的collapse-tags
          props.collapseTags = true
        }
        // 输入框设置默认placeholder
        if (this.form.component === 'el-input') {
          if (!props.placeholder) {
            props.placeholder = '请输入'
          }
        } else if (
          // 下拉选和级联菜单设置默认placeholder
          this.form.component === 'custom-select' ||
          this.form.component === 'el-cascader'
        ) {
          if (!props.placeholder) {
            props.placeholder = '请选择'
          }
        }

        // 日期选择设置默认时间
        if (
          this.form.component === 'el-date-picker' &&
          (props.type === 'datetimerange' ||
            props.type === 'daterange' ||
            props.type === 'monthrange')
        ) {
          props.defaultTime = ['00:00:00', '23:59:59']
        }

        // 进行事件绑定实现双向绑定，触发modelValues更新
        const events = {}
        // 事件定义
        events[this.form.event] = async val => {
          // 获取旧值
          const oldValue = this.$parent.modelValues[this.form.model]
          // 更新值
          this.$parent.modelValues[this.form.model] = val
          // 如果watch函数存在，则触发此函数
          this.$parent.triggerWatch(this.form, oldValue, val)
        }
        const componentName = this.form.component
        return createElement(componentName, {
          props: props,
          on: events,
          attrs: props,
          style: {
            width: this.form.width
              ? this.form.width === 'long'
                ? `${this.$parent.labelWidth + 390}px`
                : 'auto'
              : '180px'
          }
        })
      }
    }
  },
  mounted() {
    this.init().then(() => {
      this.isShowOpen()
      window.addEventListener('resize', this.isShowOpen)
    })
  },
  methods: {
    // 判断是否显示展开按钮以及展开判定
    isShowOpen() {
      // 原来已显示展开按钮
      if (this.showOpen) {
        // 内容不超出，则不显示展开按钮，并且设置高度为一行高度
        if (this.$refs.wrap.scrollHeight <= this.formHeight) {
          this.isOpen = false
          this.$refs.wrap.style.height = this.formHeight + 'px'
          this.showOpen = false
        } else if (this.isOpen) {
          // 内容超出，且本身展开按钮已展开，设置高度自适应
          this.$refs.wrap.style.height = ''
        }
      } else {
        // 未显示展开按钮
        // 统一关闭，设置高度为一行高度
        this.isOpen = false
        this.$refs.wrap.style.height = this.formHeight + 'px'
        // 判断是否需要显示展开按钮
        if (this.$refs.wrap.scrollHeight > this.formHeight) {
          this.showOpen = true
        }
      }
    },
    // 更改高度
    changeHeight() {
      // 在进行动画前先设置它的高度为自身高度
      if (this.isOpen) {
        this.$refs.wrap.style.height = this.$refs.wrap.offsetHeight + 'px'
      }

      // 进行展开/关闭操作
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$refs.wrap.style.height = this.$refs.wrap.scrollHeight + 'px'
      } else {
        this.$refs.wrap.style.height = this.formHeight + 'px'
      }
    },
    // 初始化表单数据
    async init() {
      this.isMount = false
      this.initFormData = []
      this.modelValues = {}
      this.formKeys = {}
      for (const form of this.formData) {
        // 获取初始化后的form
        let f = this.initForm(form)
        f = await f
        // 更新initFormData
        this.initFormData.push(f)
        // 添加标记
        this.$set(this.formKeys, f.model, 0)
        // 获取form对应的绑定值
        if (f.show) {
          this.$set(this.modelValues, f.model, f.props[f.modelValue])
        }
      }
      this.isMount = true
      await this.$nextTick()
      this.$emit('init', {
        ...this.modelValues
      })
    },
    // 初始化某个form
    async initForm(form) {
      const newForm = this.copy(form)
      // 组件参数对象
      const props = newForm.props || {}
      // 参数转换数组
      const excludeProps = newForm.excludeProps || []
      // 遍历组件参数对象
      for (const prop in props) {
        // 如果该参数是一个方法，并且不在非转换数组里，则进行转换，获取最终数据
        if (typeof props[prop] === 'function' && !excludeProps.includes(prop)) {
          props[prop] = props[prop].apply(this, [
            {
              ...this.modelValues
            },
            newForm.model
          ])
          if (props[prop] instanceof Promise) {
            props[prop] = await props[prop]
          }
        }
      }
      newForm.props = props
      // 组件默认为输入框
      if (!newForm.component) {
        newForm.component = 'el-input'
      }
      // 事件默认为input事件
      if (!newForm.event) {
        newForm.event = 'input'
      }
      // 双向绑定字段默认为value
      if (!newForm.modelValue) {
        newForm.modelValue = 'value'
      }
      // 转换组件component属性
      let component = newForm.component
      // 如果是动态引入的组件
      if (component instanceof Promise) {
        component = await component
        newForm.component = component.default
      }
      // show值默认为true，明确为false是才是false
      newForm.show = newForm.show !== false

      return newForm
    },
    // 根据model查询某个form（未初始化的）
    queryForm(model) {
      let i = -1
      const formArray = this.formData.filter((form, index) => {
        if (form.model === model) {
          i = index
          return true
        }
        return false
      })
      return {
        form: formArray[0],
        index: i
      }
    },
    // 查询按钮点击
    doSearch() {
      this.$emit('search', {
        ...this.modelValues
      })
    },
    // 重置表单数据
    doReset() {
      for (const f of this.initFormData) {
        // 重新设置绑定值
        this.modelValues[f.model] = f.props[f.modelValue]
      }
      for (const f of this.initFormData) {
        this.triggerWatch(
          f,
          this.modelValues[f.model],
          this.modelValues[f.model]
        )
      }
      this.$emit('reset', {
        ...this.modelValues
      })
    },
    // 触发watch
    async triggerWatch(form, oldValue, newValue) {
      if (typeof form.watch === 'function' && form.show) {
        let formObjArray = form.watch.apply(this, [
          newValue,
          oldValue,
          {
            ...this.modelValues
          },
          form.model
        ])
        if (formObjArray instanceof Promise) {
          formObjArray = await formObjArray
        }
        // 返回的单个对象改成数组
        if (formObjArray && !Array.isArray(formObjArray)) {
          formObjArray = [formObjArray]
        }
        // formObjArray是watch函数返回的值，如果值存在，则进行处理，更新指定的其他form
        if (formObjArray && formObjArray.length) {
          for (const formObj of formObjArray) {
            // 查询指定的form
            const queryRes = this.queryForm(formObj.model)
            // 如果原form含有props，且formObj含有props属性，则进行合并
            if (formObj.props && queryRes.form.props) {
              const props = { ...queryRes.form.props }
              Object.assign(props, formObj.props)
              delete formObj.props
              queryRes.form.props = props
            }
            // 合并数据
            Object.assign(queryRes.form, formObj)
            // 初始化form
            const f = await this.initForm(queryRes.form)
            // 重新设置绑定值
            this.modelValues[f.model] = f.props[f.modelValue]
            // 更新initFormData
            this.initFormData[queryRes.index] = f
            // 更新组件
            this.formKeys[f.model] = ++this.formKeys[f.model]
          }
        }
      }
    },
    // 重新渲染form
    async reRenderForm(form, index) {
      // 初始化form
      const f = await this.initForm(form)
      // 重新设置绑定值
      this.modelValues[f.model] = f.props[f.modelValue]
      // 更新initFormData
      this.initFormData[index] = f
      // 更新组件
      this.formKeys[f.model] = ++this.formKeys[f.model]
    },
    // 根据model查询某个form（初始化完成的）
    queryInitedForm(model) {
      let i = -1
      const formArray = this.initFormData.filter((form, index) => {
        if (form.model === model) {
          i = index
          return true
        }
        return false
      })
      return {
        form: formArray[0],
        index: i
      }
    },
    // 深拷贝对象和数组
    copy(obj) {
      const newObj = Array.isArray(obj) ? [] : {}
      for (const i in obj) {
        if (typeof obj[i] === 'object' && obj[i]) {
          newObj[i] = this.copy(obj[i])
        } else {
          newObj[i] = obj[i]
        }
      }
      return newObj
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.isShowOpen)
  }
}
</script>

<style scoped lang="scss">
.topBar {
  position: relative;
  background: #fff;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 2px;
  overflow: hidden;
  box-sizing: border-box;

  .topBar-wrapper {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: flex-start;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    transition: height 300ms;

    .topBar-form {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 10px;
      box-sizing: border-box;

      .topBar-form-label {
        display: block;
        margin-right: 10px;
        font-size: 14px;
        text-align: right;
        color: #262626;

        .topBar-form-require {
          color: red;
          padding-right: 3px;
        }
      }
    }
  }

  .topBar-btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;

    .topBar-btn {
      margin: 0 10px 0 0;

      &:last-child {
        margin-right: 0;
      }

      &.topBar-expand {
        color: #1890ff;
        font-size: 14px;
        cursor: pointer;
        margin-left: 12px;

        i {
          display: inline-block;
          transition: all 300ms;

          &.retract {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}

::v-deep .el-cascader__search-input {
  min-width: 10px;
}

::v-deep .el-cascader__tags .el-tag {
  max-width: 40%;
  margin: 5px 0 2px 6px;
}

::v-deep .el-input--mini .el-input__inner {
  height: 34px;
  line-height: 34px;
}
</style>
