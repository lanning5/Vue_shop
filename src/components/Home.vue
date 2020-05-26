<template>
    <div>
        <el-button @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
  data () { return {} },
  methods: {
    logout () { // 退出
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang='less' scoped>

</style>
