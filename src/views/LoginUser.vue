<template>
  <div>
    <div class="login">
      <el-form :inline="true" :rules="rules" label-position="left" label-width="150px" :model="loginForm">
<!--        <el-form-item prop="username">-->
<!--          <span slot="label" style="font-weight:bold">用户类型</span>-->
<!--          <el-select class="loginInput" v-model="loginForm.userType">-->
<!--            <el-option-->
<!--              v-for="item in allType"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <br />
        <el-form-item prop="username">
          <span slot="label" style="font-weight:bold">Username</span>
          <el-input v-model="loginForm.username" placeholder="Please enter your username" class="loginInput"></el-input>
        </el-form-item>
        <br />
        <el-form-item prop="password">
          <span slot="label" style="font-weight:bold">Password</span>
          <el-input type="password" v-model="loginForm.password" placeholder="Please enter your password" class="loginInput"></el-input>
        </el-form-item>
        <br />
        <el-button type="primary" @click="login" style="width:150px;height:40px">Login</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
      // allType: [{
      //   value: "firm",
      //   label: "厂家用户",
      // },{
      //   value: "user",
      //   label: "个人用户",
      // },
      // ],
      const loginForm = ref({
        userType: "user",
        username: "",
        password: "",
      });
      const rules = ref({
        username: [{ required: true, message: "Please enter your username", trigger: "blur" }],
        password: [{ required: true, message: "Please enter your password", trigger: "blur" }],
      });

      return {
        loginForm,
        rules,
      };
  },
  methods: {
    login() {
      if (Object.values(this.loginForm).some((item) => item === "")) {
        this.$message.warning("Please fill in all the information");
        return;
      }
      if (this.loginForm.userType === "user") {
        console.log("user login");
        const formData = new FormData();
        formData.append("username", this.loginForm.username);
        formData.append("userpwd", this.loginForm.password);
        console.log(formData.get("username"));
        console.log(formData.get("userpwd"));
        this.$axios.post("/userLogin/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((Response) => {
          console.log(Response);
          if (Response.data.status === 200){
            this.$message.success("Login Successful");
            this.$store.commit("login", Response.data.data);
            this.$router.push({ name: "home" });
          } else {
            this.$message.warning(Response.data.message);
          }
        })
        .catch((failResponse) => {
          if (failResponse.response.status === 400) {
            this.$message.warning("Incorrect username or password");
          } else {
            console.log(failResponse);
          }
        });
      }
    },
  },
};
</script>

<style>
.login {
  margin-top: 20vh;
  text-align: center;
}
.loginInput {
  margin-bottom: 5vh;
  height: 50px;
}
</style>
