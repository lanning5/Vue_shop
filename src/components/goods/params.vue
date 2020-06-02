<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert show-icon :closable="false" title="注意：只允许为第三级分类设置相关参数" type="warning"> </el-alert>
      <el-row type="flex" justify="start" align="center" style="height: 45px">
        <el-col
          >选择商品分类：
          <el-cascader ref="cascader" v-model="selecat_pid" :props="seleprops" :options="categories" @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button class="btn1" type="primary" size="medium" :disabled="isdisabled" @click="addbtn">添加参数</el-button>
          <el-table :data="attributes" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="handleClose(i, scope.row)" v-for="(tag, i) in scope.row.attr_vals" :key="tag" closable>
                  {{ tag }}
                </el-tag>

                <el-input ref="saveTagInput" class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editAttributes(scope.row)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button @click="deleteAttr(scope.row.attr_id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button class="btn1" type="primary" size="medium" :disabled="isdisabled" @click="addbtn">添加属性</el-button>
          <el-table :data="attributes" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag @close="handleClose(i, scope.row)" v-for="(tag, i) in scope.row.attr_vals" :key="tag" closable>
                  {{ tag }}
                </el-tag>

                <el-input ref="saveTagInput" class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"> </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="editAttributes(scope.row)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button @click="deleteAttr(scope.row.attr_id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog @close="addClose" :title="diaTitle" :visible.sync="dialogVisible" width="50%">
      <el-form ref="formRef" label-width="80px" :model="form" :rules="rules">
        <el-form-item prop="name" :label="activeName == 'many' ? '动态参数' : '静态属性'">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttributes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      selecat_pid: [],
      seleprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
        // checkStrictly: true
      },
      // Tabs
      activeName: 'many',
      attributes: [],
      // dialog
      dialogVisible: false,
      form: {
        name: ''
      },
      type: '',
      attrId: null,
      attr_vals: [],
      rules: {
        name: [{ required: true, message: '请输入属性名称', trigger: 'blur' }]
      }
      // inputVisible: false,
      // inputValue: ''
    }
  },
  computed: {
    seleId() {
      if (this.selecat_pid.length == 3) return this.selecat_pid[2]
      else return null
    },
    isdisabled() {
      if (this.selecat_pid.length == 3) return false
      else return true
    },
    diaTitle() {
      if (this.type == 'add') {
        if (this.activeName == 'many') {
          return '添加动态参数'
        } else return '添加静态属性'
      } else {
        if (this.activeName == 'many') {
          return '修改动态参数'
        } else return '修改静态属性'
      }
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    async getCategories() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res.data)
      this.categories = res.data
    },
    // 级联选择器发生变化
    async handleChange() {
      if (this.selecat_pid.length != 3) {
        this.selecat_pid = []
        this.attributes = []
        return
      }
      //  处理
      this.getAttributes()
    },
    handleTabClick() {
      console.log(this.activeName)
      this.getAttributes()
    },
    async getAttributes() {
      if (this.selecat_pid.length != 3) return
      const { data: res } = await this.$http.get(`categories/${this.seleId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputValue = ''
        item.inputVisible = false
      })
      this.attributes = res.data
    },
    addbtn() {
      this.dialogVisible = true
      this.type = 'add'
    },
    addClose() {
      this.$refs.formRef.resetFields()
      this.form.name = ''
    },
    async addAttributes() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          let res
          if (this.type == 'add') {
            const { data: res0 } = await this.$http.post(`categories/${this.seleId}/attributes`, {
              attr_name: this.form.name,
              attr_sel: this.activeName
            })
            res = res0
            if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          } else if (this.type == 'edit') {
            const { data: res0 } = await this.$http.put(`categories/${this.seleId}/attributes/${this.attrId}`, {
              attr_name: this.form.name,
              attr_sel: this.activeName,
              attr_vals: this.attr_vals.join(',')
            })
            res = res0
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          } else return
          this.getAttributes()
          this.$message.success({
            message: res.meta.msg,
            duration: 1000
          })
          this.dialogVisible = false
        }
      })
    },
    editAttributes(row) {
      this.dialogVisible = true
      console.log(row)
      this.type = 'edit'
      this.attrId = row.attr_id
      this.form.name = row.attr_name
      this.attr_vals = row.attr_vals
    },
    async deleteAttr(id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${this.seleId}/attributes/${id}`)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getAttributes()
          this.$message.success({
            message: res.meta.msg,
            duration: 1000
          })
        })
        .catch(err => console.log(err))
    },
    // 删除
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAtteVals(row)
    },
    showInput(row) {
      row.inputVisible = true
      // $nextTick 就是当页面上的元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async handleInputConfirm(row) {
      const inputValue = row.inputValue
      if (inputValue) {
        row.attr_vals.push(inputValue)
      }
      row.inputVisible = false
      row.inputValue = ''
      // 发起网络请求
      this.saveAtteVals(row)
    },
    // 保存attr_vals 保存到数据库
    async saveAtteVals(row) {
      // 发起网络请求
      const { data: res } = await this.$http.put(`categories/${this.seleId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped>
.el-icon-warning-outline {
  font-size: 20px;
  color: orange;
}
.el-col {
  line-height: 45px;
  display: flex;
  justify-content: start;
  align-items: center;
  margin-right: 10px;
}
.btn1 {
  display: flex;
  justify-content: start;
  margin-bottom: 15px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-card{
  margin-top: 25px;
}
</style>
