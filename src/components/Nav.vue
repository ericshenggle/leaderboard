<template>
  <el-row justify="space-between">
    <el-col :span="6" class="icon">SQL Leaderboard</el-col>
    <el-col :span="6">
      <el-menu :default-active="currentRoute" class="el-menu-demo" mode="horizontal" active-text-color="#5698c3" router>
        <el-menu-item index="/">HomePage</el-menu-item>
        <el-sub-menu v-if="isLogin" :default-active="currentRoute">
          <template #title>My Account</template>
<!--          <el-menu-item index="/user/home">Home</el-menu-item>-->
          <el-menu-item index="/updatePwd">UpdatePwd</el-menu-item>
          <el-menu-item @click="logout">Logout</el-menu-item>
        </el-sub-menu>
        <el-sub-menu v-else :default-active="currentRoute">
          <template #title>Login</template>
          <el-menu-item index="/login">Login</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: 'Nav',
  data() {
    return {
      currentRoute: '1',
      isLogin: false,
    };
  },
  methods: {
    logout() {
      this.$store.commit('logout');
    },
    handleLogin() {
      this.isLogin = this.$store.state.isAuthenticated;
    },
  },
  mounted() {
    this.handleLogin();
  }
};
</script>

<style>
.el-menu-demo {
  width: 100%;
  background-color: #ffffff;
}
.icon {
  width: 300px;
  padding-left: 50px;
  font-size: 40px;
  color: rgb(126, 176, 255);
}
</style>
