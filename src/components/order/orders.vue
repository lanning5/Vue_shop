<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-input class="seleInput" clearable placeholder="请输入内容" v-model="inputVal">
        <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
      </el-input>

      <!-- 表格区域 -->
      <el-table :data="orderList" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="220"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-button v-if="scope.row.order_pay == 0" type="danger" size="mini" plain>未付款</el-button>
            <el-button v-else type="success" size="mini" plain>已付款</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="下单时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox(scope.row)">编辑</el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showMapBox(scope.row)">定位</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 20, 50, 100]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background> </el-pagination>
    </el-card>

    <!-- 修改位置 -->
    <el-dialog title="修改位置" :visible.sync="dialogVisible" width="50%" @close="closeDialogDre">
      <el-form :model="addressForm" :rules="addressRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省区/县" prop="address1">
          <el-cascader v-model="addressForm.address1" :options="cityData" :props="{ expandTrigger: 'hover' }" clearable @change="changeadd"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 位置地图 -->
    <el-dialog title="物流进度" :visible.sync="mapDialogVisible" width="50%" @close="closeDialogDre">
      <el-timeline :reverse="false">
        <el-timeline-item v-for="(item, index) in kuaidi" :key="index" :timestamp="item.ftime">
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      orderList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      inputVal: '',
      arrrr: {
        user_id: '',
        pay_status: '',
        is_send: '',
        order_fapiao_title: '',
        order_fapiao_company: '',
        order_fapiao_content: '',
        consignee_addr: ''
      },
      total: 0,
      dialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressRules: {
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        address1: [{ required: true, message: '请选择省区/县', trigger: 'blur' }]
      },
      cityData,
      mapDialogVisible: false,
      // 物流信息
      kuaidi: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res.data)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 搜索
    searchGoods() {
      this.queryInfo.query = this.inputVal.trim()
      this.getOrderList()
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOrderList()
    },
    showBox(row) {
      this.dialogVisible = true
    },
    closeDialogDre() {
      this.addressForm.address1 = []
      this.addressForm.address2 = ''
    },
    changeadd() {
      console.log(this.addressForm)
    },
    async showMapBox(row) {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.kuaidi = res.data
      console.log(this.kuaidi)
      this.mapDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.seleInput {
  float: left;
  width: 50%;
  margin-bottom: 20px;
}
.el-pagination {
  margin: 20px 0;
  float: left;
}
.el-cascader {
  width: 100%;
}
</style>
