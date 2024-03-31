<template>
  <el-container>
    <el-header>
      <Nav/>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>

import Nav from "@/components/Nav.vue";

export default {
  components: {Nav},
  created() {
    //load the userMsg from localStorage to vuex store
    localStorage.getItem("userMsg") && this.$store.replaceState(Object.assign(this.$store.state,JSON.parse(localStorage.getItem("userMsg"))));

    //store the userMsg from vuex store to localStorage before the page is closed or refreshed
    window.addEventListener("beforeunload",()=>{
      localStorage.setItem("userMsg",JSON.stringify(this.$store.state))
    })
  }
};
</script>