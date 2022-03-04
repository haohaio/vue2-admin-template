<script>
import { Select } from 'element-ui'
export default {
  name: 'custom-select',
  props: {
    ...Select.props,
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: 'label',
          value: 'value'
        }
      }
    }
  },
  render(createElement) {
    // 定义el-option
    const options = []
    for (const opt of this.options) {
      options.push(
        createElement('el-option', {
          props: {
            label: this.props.label ? opt[this.props.label] : opt.label,
            value: this.props.value ? opt[this.props.value] : opt.value
          }
        })
      )
    }
    return createElement(
      Select,
      {
        props: this.$props,
        on: this.$listeners,
        attrs: this.$attrs
      },
      options
    )
  }
}
</script>
