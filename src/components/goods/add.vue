<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert center title="添加商品信息" show-icon type="info" effect="dark" :closable="false"> </el-alert>

      <!-- 步骤条 -->
      <el-steps :active="+active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单 -->
      <el-form :model="addForm" :rules="formRules" ref="addForm" label-position="top" label-width="100px">
        <!-- tabs标签 -->
        <el-tabs v-model="active" :before-leave="beforeTapLeave" tab-position="left" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <template>
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item class="myitem" label="商品分类" prop="goods_cat">
                <div>
                  <el-cascader class="mycascader" ref="cascader" @change="handleChange" clearable v-model="addForm.goods_cat" :options="categories" :props="cascaderProps"></el-cascader>
                </div>
              </el-form-item>
            </template>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyAttributes" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="value" v-for="value in item.attr_vals" :key="value" border=""></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyAttributes" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品照片" name="3">
            <!--action 上传的地址  -->
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="fileUpload" list-type="picture" :headers="headerObj">
              <el-button class="uploadBtn" size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods" style="marginTop:20px">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="40%">
      <img :src="imgURL" alt="图片" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      active: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [1, 3, 6],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      formRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'change' }]
      },
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
        // checkStrictly: true
      },
      categories: [],
      manyAttributes: [],
      onlyAttributes: [],
      // 图片上传请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      imgDialogVisible: false,
      imgURL: ''
    }
  },
  created() {
    this.getCategories()
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2]
      } else return null
    }
  },
  methods: {
    handleStep() {},
    async tabClick() {
      // 商品参数面板
      if (this.active == '1') {
        console.log('参数')
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.forEach(item => {
          if (item.attr_vals.length == 0) {
            item.attr_vals = []
            return
          }
          item.attr_vals = item.attr_vals.split(',')
        })
        this.manyAttributes = res.data
      }
      // 商品属性 面板
      else if (this.active == '2') {
        console.log('属性')
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyAttributes = res.data
        console.log(this.onlyAttributes)
      }
    },
    async getCategories() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.categories = res.data
    },
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = []
        // this.attributes = []
        return
      }
    },
    beforeTapLeave(activeName, oldtapName) {
      if (oldtapName == '0' && this.addForm.goods_cat.length != 3) {
        this.$message.warning('三级商品分类尚未选择')
        return false
      }
    },
    // on-preview点击文件列表中已上传的文件时的钩子,处理图片预览效果
    handlePreview(file) {
      this.imgURL = file.response.data.url
      this.imgDialogVisible = true
    },
    // 处理删除图片操作
    handleRemove(file, fileList) {
      const path = file.response.data.tmp_path
      this.addForm.pics.some((item, i) => {
        if (item.pic == path) {
          this.addForm.pics.splice(i, 1)
          return true
        }
      })
    },
    // 添加图片
    fileUpload(response, file, fileList) {
      console.log(response, file, fileList)
      if (response.meta.status !== 200) return this.$message.error(response.meta.msg)
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
      console.log('add', this.addForm.pics)
    },
    addGoods() {
      this.$refs.addForm.validate(async valid => {
        console.log(valid)
        if (!valid) {
          this.$message.error('基本信息尚未填写完整')
        } else {
          // 注意，不能直接将this.addForm.goods_cat转化为字符串，因为已经绑定到表单的级联选择器中（绑定的为数组）
          const obj = _.cloneDeep(this.addForm)
          obj.goods_cat = obj.goods_cat.join(',')
          // 处理动态属性
          let manyArr = []
          this.manyAttributes.forEach(item => {
            let obj = {}
            obj.attr_id = item.attr_id
            obj.attr_value = item.attr_vals.join(',')
            manyArr.push(obj)
          })
          // 处理静态属性
          let onlyArr = []
          console.log(this.onlyAttributes)
          this.onlyAttributes.forEach(item => {
            let obj = {}
            obj.attr_id = item.attr_id
            obj.attr_value = item.attr_vals
            onlyArr.push(obj)
          })
          obj.attrs = [...manyArr, ...onlyArr]
          const { data: res } = await this.$http.post('goods', obj)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success({
            message: res.meta.msg,
            duration: 1000
          })
          this.$router.push('/goods')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.el-steps {
  margin: 30px 0;
}
.el-alert {
  height: 45px;
  line-height: 45px;
}
.el-form-item {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.myitem {
  display: flex;
  flex-direction: column;
  .el-cascader {
    float: left;
  }
}
.el-checkbox {
  float: left;
  margin: 0 5px 10px 0 !important;
}
.el-upload {
  display: flex;
  justify-content: start;
}

// .el-cascader{
//   float: left;
//   // margin-left: -800px;
// }
</style>
