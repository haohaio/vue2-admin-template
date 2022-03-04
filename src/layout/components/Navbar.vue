<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="right-menu">

      <el-dropdown @command="handleCommand">
        <div class="dropdown-content">
          <img class="avatar" src="@/assets/user.png">
          <span>admin</span>
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout" icon="el-icon-refresh-right">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <ConfirmDialog ref="dialog" content="确定退出登录吗？" @confirm="handleLogout" center append-to-body></ConfirmDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { logout } from '@/api/auth.js'
import { removeToken, removeUsername } from '@/utils/auth.js'
import Hamburger from '@/components/Hamburger'

export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  components: {
    Hamburger,
    ConfirmDialog: () => import('@/components/ConfirmDialog')
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleLogout() {
      logout().then(() => {
        removeToken()
        removeUsername()
        this.$router.push('/login')
      })
    },
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.$refs.dialog.open()
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.module.scss';

.navbar {
  height: $navHeight;
  overflow: hidden;
  position: relative;
  background: $navBg;
  box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
  color: #666;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .hamburger-container {
    cursor: pointer;
    transition: background 0.3s;
  }

  .right-menu {
    text-align: right;
    font-size: 14px;
    display: flex;
    align-items: center;
  }
}

.dialog-title {
  display: inline-block;
  width: 100%;
  text-align: center;
}

.icon-reset {
  margin-right: 20px;
  font-size: 18px;
  cursor: pointer;
  vertical-align: middle;
}

.dropdown-content {
  display: flex;
  align-items: center;

  .avatar {
    margin-right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
}
</style>
