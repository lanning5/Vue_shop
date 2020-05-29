<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单区域 -->
      <!-- ref 为了取实例对象 -->
      <!-- :rules="rules"  prop="username" （prop加给item）绑定验证规则-->
      <el-form ref="loginFormRef" :model="lform" class="form_login" :rules="rules">
        <!-- 输入框区域 -->
        <el-form-item prop="username">
          <el-input v-model="lform.username" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input show-password v-model="lform.password" placeholder="请输入密码" prefix-icon="el-icon-unlock"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// axios.defaults.baseURL = ''
export default {
  data() {
    return {
      lform: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度最少6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLogin() {
      // console.log(this.$refs.loginFormRef);
      // this.$refs.loginFormRef 取表单的实例，表单中设有ref属性
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // validate 是form表单预验证，接受一个回调函数（参数为验证返回的布尔值）
      this.$refs.loginFormRef.validate(async valid => {
        console.log(valid)
        // 验证成功
        if (valid) {
          // 解构返回对象里的data
          console.log('sss')

          const { data: res } = await this.$http.post('login', this.lform)
          console.log(res, 'ssss')
          // element-ui 的消息弹窗  this.$message(已挂载到Vue.prototype)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          // 成功登录
          console.log(res)

          this.$message.success('登录成功')
          // 1. 将登录成功之后的 token 保存到客户端的sessionStorage 中
          //      1.1. 项目中除了登录之外的其它API接口，必须在登录之后才能访问
          //      1.2. token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage中
          // 2. 通过编程式导航跳转到后台主页
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    // top: -25%;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
  // padding-right: 10px;
}
.form_login {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
}
</style>
