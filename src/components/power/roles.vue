<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 角色区域 -->
    <el-card class="box-card">
      <el-row class="btn1">
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <!-- b表格区域 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展開行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row type="flex" align="middle" class="firstrow" v-for="item1 in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeByid(scope.row, item1.id)" closable>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级级权限 -->
              <el-col :span="19">
                <el-row class="secrow" type="flex" align="middle" v-for="item2 in item1.children" :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag @close="removeByid(scope.row, item2.id)" closable size="medium" type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="18" class="thirow">
                    <el-tag closable size="medium" @close="removeByid(scope.row, item3.id)" type="warning" v-for="item3 in item2.children" :key="item3.id">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" >编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" >删除</el-button>
            <!-- 提示文字 -->
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限 -->
    <el-dialog title="分配权限" :visible.sync="showSetDialog" width="50%" @close="clearClose">
      <!-- 树形结构 -->
      <el-tree ref="treeRef" :data="authList" :props="defaultProps" show-checkbox :default-checked-keys="checkList" node-key="id" default-expand-all> </el-tree>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetDialog = false">取 消</el-button>
        <el-button type="primary" @click="updataAuth">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      showSetDialog: false,
      // 权限树的数据
      authList: [],
      // 树展示的数据
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点id值
      checkList: [],
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res.data)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    removeByid(role, rightId) {
      this.$confirm('此操作将移除改权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + role.id + '/rights/' + rightId)
          console.log(res.data)
          if (res.meta.status != 200) return this.$message.error(res.meta.msg)
          // 不建议用this.getRolesList()，因为会重新渲染而导致关闭展开
          // this.getRolesList()
          role.children = res.data
          this.$message.success({
            message: res.meta.msg,
            duration: 1000
          })
        })
        .catch(err => err)
    },
    async showDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res.data)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.authList = res.data
      // 递归获取显示的节点
      this.getcheckList(role, this.checkList)
      this.showSetDialog = true
    },
    // 获取三级权限的id
    getcheckList(node, arr) {
      // 如果是三级节点，则增加id來默認選中
      if (!node.children) {
        return arr.push(node.id)
      } else {
        // 如果有children，则递归
        node.children.forEach(item => {
          this.getcheckList(item, arr)
        })
      }
    },
    // 监听关闭
    clearClose() {
      this.checkList = []
    },
    async updataAuth() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post('roles/' + this.roleId + '/rights', { rids: idStr })
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success({
        message: res.meta.msg,
        duration: 1000
      })
      this.getRolesList()
      this.showSetDialog = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.btn1 {
  display: flex;
  justify-content: start;
  margin-bottom: 14px;
}
.el-row {
  line-height: 50px;
}
.firstrow:first-child {
  border-top: 1px solid #eee;
}
.firstrow {
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
  .secrow:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  .secrow {
    margin-bottom: 5px;
    .thirow {
      display: flex;
      flex-wrap: wrap;
      justify-content: start;
      align-content: space-between;
      .el-tag {
        margin-left: 10px;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
