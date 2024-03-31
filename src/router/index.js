import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from "@/views/LoginUser.vue";
import Question from "@/views/Question.vue";
import UpdatePwd from "@/views/UpdatePwd.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/updatePwd',
    name: 'updatepassword',
    component: UpdatePwd
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/question/:id',
    name: 'question',
    component: Question
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
