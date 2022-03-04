<template>
  <div class="login">
    <div class="login-body">
      <div class="title">欢迎使用人脸识别终端</div>
      <div>
        <el-input placeholder="请输入用户名" v-model="form.user">
          <i slot="prefix" class="el-input__icon el-icon-user"></i>
        </el-input>
      </div>
      <div>
        <el-input type="password" placeholder="请输入密码" v-model="form.passwd" @keyup.enter.native="handleLogin">
          <i slot="prefix" class="el-input__icon el-icon-lock"></i>
        </el-input>
      </div>
      <el-button type="primary" @click="handleLogin" class="login-btn">登录</el-button>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { login } from '@/api/auth.js'
import { setToken, setUsername } from '@/utils/auth.js'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        user: '',
        passwd: ''
      }
    }
  },
  methods: {
    handleLogin() {
      if (!this.form.user || !this.form.passwd) {
        return this.$message.error('请输入用户名或密码')
      }
      const params = {
        user: this.form.user,
        passwd: md5(`${this.form.user}${this.form.passwd}`)
      }
      login(params).then(res => {
        setToken(res.token)
        setUsername(this.form.user)
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url('../../assets/login_bg.png') no-repeat;
  background-size: cover;
  position: relative;

  .login-body {
    width: 400px;
    height: 353px;
    background: #ffffff;
    border-radius: 4px;
    position: absolute;
    right: 10%;
    top: 50%;
    transform: translate(0, -50%);
    display: flex;
    flex-flow: column;
    align-items: center;

    .title {
      font-size: 30px;
      color: #303133;
      font-weight: 600;
      margin: 36px 0 24px;
    }

    ::v-deep .el-input {
      margin-bottom: 24px;
      width: 288px;
    }

    .login-btn {
      width: 288px;
      height: 40px;
      font-size: 16px;
      letter-spacing: 6px;
      margin-top: 16px;
    }
  }
}
</style>
