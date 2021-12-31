import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'
import axios from 'axios'
// 设置后端请求地址
// axios.defaults.baseURL='http://localhost:7600';
//axios.defaults.baseURL='http://192.168.1.23:8091/';
axios.defaults.baseURL='http://119.91.29.66:8091/';



const app = createApp(App)

installElementPlus(app)
app
    .use(store)
    .use(router)
    .mount('#app')
//export default axios
