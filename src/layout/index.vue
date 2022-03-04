<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div class="fixed-header">
        <navbar />
        <div class="page-title">{{$route.meta.title}}</div>
      </div>
      <app-main class="app-main-container" />
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar } from './components'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.module.scss';

.app-wrapper {
  position: relative;
  height: 100%;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.app-main-container {
  padding: calc(#{$navHeight} + 78px) 18px 18px;
  height: 100%;
}

.hideSidebar .fixed-header {
  width: calc(100% - #{$sideBarHideWidth});
}

.breadcrumb-container {
  background-color: #fff;
}

.page-title {
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  color: #262626;
  background: #fff;
  padding-left: 32px;
  font-weight: 500;
}
</style>
