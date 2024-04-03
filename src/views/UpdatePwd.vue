<template>
  <div>
    <div class="register">
      <el-form :inline="true" :rules="rules" label-position="left" label-width="80px" :model="updateForm">
        <el-form-item prop="username">
          <span slot="label" style="font-weight:bold">Username</span>
          <el-input v-model="updateForm.username" placeholder="Please enter your username" class="regInput"></el-input>
        </el-form-item>
        <br />
        <el-form-item prop="password">
          <span slot="label" style="font-weight:bold">Origin Password</span>
          <el-input type="password" v-model="updateForm.origin" placeholder="Please enter your origin password" class="regInput"></el-input>
        </el-form-item>
        <br />
        <el-form-item prop="password">
          <span slot="label" style="font-weight:bold">New Password</span>
          <el-input type="password" v-model="updateForm.password" placeholder="Please enter your new password" class="regInput"></el-input>
        </el-form-item>
        <br />
        <el-form-item prop="re_password">
          <span slot="label" style="font-weight:bold">Re-enter Password</span>
          <el-input type="password" v-model="updateForm.re_password" placeholder="Please re-enter your new password" class="regInput"></el-input>
        </el-form-item>
        <br />
        <br />
        <el-button type="primary" @click="register" style="width:100px;height:40px">Update</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const updateForm = ref({
      username: "",
      origin: "",
      password: "",
      re_password: ""
    });
    const rules = ref({
      username: [{ required: true, message: "Please enter your username", trigger: "blur" }],
      origin: [{ required: true, message: "Please enter your origin password", trigger: "blur" }],
      password: [{ required: true, message: "Please enter your password", trigger: "blur" }],
      re_password: [{ required: true, message: "Please re-enter your password", trigger: "blur" }],
    });
    return {
      updateForm,
      rules
    };
  },
  methods: {
    register() {
      if (this.updateForm.password !== this.updateForm.re_password) {
        this.$message.warning("The two passwords do not match. Please re-enter.");
        return;
      }
      this.$axios
        .post("/userUpdate/", {
          username: this.updateForm.username,
          originpwd: this.updateForm.origin,
          userpwd: this.updateForm.password
        }, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((Response) => {
          if (Response.data.status === 200) {
            this.$message.success("Update pwd successful");
            this.$router.push({ name: "login" });
          } else {
            this.$message.warning(Response.data.message);
          }
        })
        .catch((failResponse) => {
          if (failResponse.response.status === 400) {
            this.$message.warning(failResponse.response.data.message);
          }
          console.log(failResponse);
        });
    },
  },
};
</script>

<style>
.register {
  text-align: center;
  margin-top: 10vh;
}
.regInput {
  margin-bottom: 2vh;
}
.link-btn-right {
  margin-left: 27%;
  font-size: 12px !important;
  line-height: 39px;
}
</style>
