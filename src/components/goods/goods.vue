<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 顶部输入框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" v-model="inputVal" class="input-with-select" @change="searchGoods">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table ref="singleTable" :data="goodslist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="680"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" width="170">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleGood(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[10, 50, 100, 200, 300, 400]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background=""> </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVal: '',
      // 商品列表
      goodslist: [],
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 选择每页多少个数据
    handleSizeChange(val) {
      console.log(val)
      this.queryInfo.pagesize = val
      this.getGoodsList()
    },
    // 跳转页数
    handleCurrentChange(val) {
      console.log(val)
      this.queryInfo.pagenum = val
      this.getGoodsList()
    },
    // 搜索商品
    searchGoods() {
      console.log(this.inputVal)
      this.queryInfo.query = this.inputVal.trim()
      this.getGoodsList()
    },
    // 删除商品
    deleGood(id) {
      this.$confirm('是否要删除此商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.getGoodsList()
          this.$message.success({
            message: res.meta.msg,
            duration: 1000
          })
        })
        .catch(err => console.log(err))
    },
    // 跳转到添加商品页面
    addGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 18px;
}
.el-pagination {
  display: flex;
  justify-content: start;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 18px;
}
</style>
