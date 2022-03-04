<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { compile } from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: []
    }
  },
  watch: {
    $route(route) {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      this.levelList = []
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      console.log(matched)

      matched.forEach(route => {
        if (route.meta.preBreadcrumb) {
          this.levelList.push(route.meta.preBreadcrumb)
          this.levelList.push(route)
        } else if (route.meta.breadcrumb !== false) {
          this.levelList.push(route)
        }
      })
    },
    pathCompile(path) {
      const { params } = this.$route
      var toPath = compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (this.$route.fullPath === redirect || this.$route.fullPath === path) {
        return
      }
      if (redirect) {
        return this.$router.push(redirect)
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.module.scss';

.app-breadcrumb.el-breadcrumb {
  height: $breadcrumbHeight;
  font-size: 14px;
  line-height: $breadcrumbHeight;
  padding-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
