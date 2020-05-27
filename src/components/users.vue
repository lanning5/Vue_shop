<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!--  -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <el-input clearable placeholder="请输入内容" v-model="queryinfo.query" @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-edit" circle @click="changeMsg(scope.row)"></el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" circle @click="deleUser(scope.row.id)"></el-button>
            <!-- 提示文字 -->
            <el-tooltip effect="dark" content="分享角色" placement="top" :enterable="false">
              <el-button size="small" type="warning" icon="el-icon-setting" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[1, 2, 3, 5]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>

    <!-- 添加用户窗口 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="diaclose" width="50%">
      <el-form :model="userform" :rules="rules" ref="addUserRef">
        <el-form-item prop="username" label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="userform.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="用户密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="userform.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="userform.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" :label-width="formLabelWidth">
          <el-input v-model="userform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogVisible" width="50%">
      <el-form :model="changeform" ref="changeUserRef" :rules="editrules">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="changeform.username" disabled=""></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
          :label-width="formLabelWidth"
          :rules="[
            { required: false, trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]"
        >
          <el-input v-model="changeform.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" :label-width="formLabelWidth">
          <el-input v-model="changeform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //   验证手机号码
    var validatePass = (rule, value, callback) => {
      // 可为空，若不为空，则验证
      if (value == '') callback()
      value = value.trim()
      const regPhone = /^(0|86|17951)?((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
      //   var phonereg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
      const bool = regPhone.test(value)
      if (!bool) callback(new Error('请输入正确的手机号'))
      else callback()
    }

    return {
      userList: [],
      total: 0,
      queryinfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      //   添加用户
      dialogFormVisible: false,
      userform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度最少6位', trigger: 'blur' }
        ],
        email: [
          { required: false, trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [{ validator: validatePass, trigger: 'blur' }]
      },
      formLabelWidth: '120px',
      //   编辑用户
      changeform: {
        email: '',
        mobile: '',
        id: undefined
      },
      editrules: {
        mobile: [
          { required: false, trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      dialogVisible: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryinfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 打开编辑用户窗口
    changeMsg(user) {
      this.dialogVisible = true
      this.changeform.id = user.id
      this.changeform.username = user.username
      this.changeform.email = user.email
      this.changeform.mobile = user.mobile
    },
    changeUser() {
      this.$refs.changeUserRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.changeform.id, this.changeform)
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        else {
          this.$message.success({
            message: res.meta.msg,
            duration: 1000
          })
          this.getUserList()
          this.dialogVisible = false
        }
      })
    },
    async changeState(user) {
      const { data: res } = await this.$http.put('users/' + user.id + '/state/' + user.mg_state)
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success({
        message: res.meta.msg,
        duration: 1000
      })
    },
    // 监听 pagesizes 改变的事件
    handleSizeChange(val) {
      this.queryinfo.pagesize = val
      this.getUserList()
    },
    //   监听页码值改变的事件
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getUserList()
    },
    islastpage() {
      let page = parseInt(this.total / this.queryinfo.pagesize)
      if (this.total % this.queryinfo.pagesize != 0) page++
      return this.queryinfo.pagenum == page
    },
    //  添加用户
    sendUser() {
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return
        if (valid) {
          const { data: res } = await this.$http.post('users', this.userform)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          //   添加成功
          else {
            this.$message.success({
              message: res.meta.msg,
              duration: 1000
            })
            this.getUserList()
            // 重置form 对象
            this.$refs.addUserRef.resetFields()
            // 关闭窗口
            this.dialogFormVisible = false
          }
        }
      })
      //   this.dialogFormVisible = false
    },
    diaclose() {
      this.$refs.addUserRef.resetFields()
    },
    async deleUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          else {
            // 判断删除后是否要回到前一页
            if (this.islastpage()) {
              // 如果在最后一页并删除后少一页，则目前页数减一
              if ((this.total - 1) % this.queryinfo.pagesize == 0) this.queryinfo.pagenum--
            }
            this.getUserList()
            this.$message.success({
              message: res.meta.msg,
              duration: 1000
            })
          }
        })
        .catch(err => err)
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 20px;
  //   height: auto;
}
.el-table {
  margin-top: 16px;
}
.el-pagination {
  margin-top: 16px;
  display: flex;
  justify-content: start;
}
</style>
