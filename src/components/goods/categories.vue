<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row class="btn1">
        <el-button type="primary" @click="addclass">添加分类</el-button>
      </el-row>
      <!-- 表单 -->
      <!-- 表格区域 -->
      <tree-table :data="goodsList" :columns="columns" show-index index-text="#" border :expand-type="false" :selection-type="false">
        <template slot="isok" slot-scope="scope">
          <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color:lightgreen"></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>
        <template slot-scope="scope" slot="sort">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level == 2" type="warning">三级</el-tag>
        </template>
        <template slot-scope="scope" slot="mado">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 底部跳转页数 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[3, 5, 8, 10, 15]" :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" @close="addColse" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form" :model="form" label-width="80px" :rules="addrules">
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="菜单选择">
          <el-cascader ref="cascader" v-model="selecat_pid" style="width:100%" :props="seleprops" :options="parentList" @change="handleChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类的列表
      goodsList: [],
      // 为table 指定列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 作用域插槽
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          // 作用域插槽
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          // 作用域插槽
          type: 'template',
          template: 'mado'
        }
      ],
      // 查询条件
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      //
      dialogVisible: false,
      form: {
        cat_name: '',
        cat_level: 0,
        cat_pid: 0
      },
      seleprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      parentList: [],
      selecat_pid: [],
      addrules: {
        cat_name: [{ required: true, message: '活动名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getgoodsList()
  },
  methods: {
    async getgoodsList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryinfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.result
      this.total = res.data.total
    },
    islastpage() {
      let page = parseInt(this.total / this.queryinfo.pagesize)
      if (this.total % this.queryinfo.pagesize != 0) page++
      return this.queryinfo.pagenum == page
    },
    // 监听 pagesizes 改变的事件
    handleSizeChange(val) {
      this.queryinfo.pagesize = val
      this.getgoodsList()
    },
    //   监听页码值改变的事件
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getgoodsList()
    },
    async addclass() {
      await this.getparentList()
      this.dialogVisible = true
    },
    // 获取父级分类
    async getparentList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentList = res.data
    },
    handleChange() {
      // 监听值发生变化就关闭它
      this.$refs.cascader.dropDownVisible = false
      // 如果selecat_pid 长度大于0，则有选择父级分类
      if (this.selecat_pid.length > 0) {
        this.form.cat_pid = this.selecat_pid[this.selecat_pid.length - 1]
        this.form.cat_level = this.selecat_pid.length
      } else {
        this.form.cat_pid = 0
        this.form.cat_level = 0
      }
    },
    // 添加分类
    saveRoleInfo() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('categories', this.form)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success({
            message: res.meta.msg,
            duration: 1000
          })
          this.getgoodsList()
          this.dialogVisible = false
        }
      })
    },
    addColse() {
      this.selecat_pid = []
      this.form = {
        cat_name: '',
        cat_level: 0,
        cat_pid: 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btn1 {
  display: flex;
  justify-content: start;
  margin-bottom: 20px;
}
.el-card {
  margin-top: 20px;
}
.el-icon-circle-check {
  color: aquamarine;
}
.el-icon-circle-close {
  color: red;
}
.el-pagination {
  display: flex;
  justify-content: start;
}
.el-icon-success,
.el-icon-error {
  font-size: 20px;
}
</style>
