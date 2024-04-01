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
  methods: {
    saveToLocalStorage() {
      const now = new Date().getDate();
      const expire = now + 60 * 60 * 12 * 1000;
      const data = {
        userMsg: this.$store.state,
        expire: expire
      };
      localStorage.setItem("userMsg", JSON.stringify(data));
    },
    getFromLocalStorage() {
      const data = JSON.parse(localStorage.getItem("userMsg"));
      if (data && data.expire > new Date().getDate()) {
        this.$store.replaceState(Object.assign(this.$store.state, data.userMsg));
      } else if (data && data.expire < new Date().getDate()) {
        localStorage.removeItem("userMsg");
      }
    }
  },
  created() {
    //load the userMsg from localStorage to vuex store
    this.getFromLocalStorage();

    //store the userMsg from vuex store to localStorage before the page is closed or refreshed
    window.addEventListener("beforeunload",()=>{
      this.saveToLocalStorage()
    })
  }
};
</script>