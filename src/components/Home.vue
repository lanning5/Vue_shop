<template>
  <div class="all-container">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="../assets/ci.jpg" alt class="img0" />
          <span>电商后台管理系统</span>
        </div>

        <el-button @click="logout">退出</el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="collapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu unique-opened class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :collapse="collapse" :collapse-transition="false" router>
            <!-- 一级菜单 -->
            <!-- index 要为字符串，所以要转换为字符串 可以+ "" 如果el-menu开始router属性，index会变成跳转名-->
            <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconobj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+secitem.path" v-for="secitem in item.children" :key="secitem.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ secitem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  created() {
    this.getMenulist()
  },
  data() {
    return {
      menulist: [],
      iconobj: {
        125: 'el-icon-user',
        103: 'el-icon-setting',
        101: 'el-icon-s-cooperation',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      collapse: false
    }
  },
  methods: {
    logout() {
      // 退出
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    async getMenulist() {
      const { data: res } = await this.$http.get('menus')
      this.menulist = res.data
    },
    // 切换折叠
    toggleCollapse() {
      this.collapse = !this.collapse
    }
  }
}
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}
.el-header,
.el-footer {
  background-color: #373d41;
  color: #fff;
  height: 60px;
  line-height: 60px;
  font-style: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  > div {
    display: flex;
    span {
      margin-left: 16px;
    }
  }
  // margin: 0;
  .img0 {
    height: 60px;
    width: 70px;
    border-radius: 50%;
  }
}

.el-aside {
  background-color: #333744;
  color: #333;
  text-align: center;
  line-height: 200px;
  .el-menu-vertical-demo {
    text-align: left;
    border-right: none;
  }
  .toggle-button {
    background: #4a5064;
    text-align: center;
    line-height: 25px;
    font-size: 10px;
    color: #fff;
    letter-spacing: 0.2em;
    // 鼠标移入小手
    cursor: pointer;
  }
}

.el-main {
  background-color: #eaedf1;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.all-container {
  height: 100%;
  > .el-container {
    height: 100%;
    margin-bottom: 40px;
  }
}
</style>
