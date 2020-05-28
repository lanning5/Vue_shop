<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 权限区域 -->
    <el-card class="box-card">
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限的名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
              <el-tag :type="btntype[scope.row.level]">{{ scope.row.level | capitalize }}级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
      btntype: ['primary', 'success', 'warning']
    }
  },
  created() {
    this.getRightsList('list')
  },
  methods: {
    async getRightsList(type) {
      const { data: res } = await this.$http.get('rights/' + type)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      console.log(res.data)
      this.rightsList = res.data
    }
  },
  filters: {
    capitalize(value) {
      const arr = ['一', '二', '三', '四', '五']
      return arr[value]
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
</style>
