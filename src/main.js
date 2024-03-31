import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from '@/plugins/axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import message from "@/plugins/message";

const app = createApp(App).use(store).use(router).use(ElementPlus).use(message)

app.config.globalProperties.$axios = axios


router.beforeEach((to, from, next) => {
    let user = localStorage.getItem('user')
    if (user) {
        store.commit('login', JSON.parse(user))
    }
    next()
})

app.mount('#app')