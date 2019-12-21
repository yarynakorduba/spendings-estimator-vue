import Vue from "vue"
import VueRouter from "vue-router"
import App from "./components/App"
import router from "./router"
import store from "./store"

import "../styles/index.scss"

Vue.config.productionTip = false
Vue.component("Day", () => import("./components/Day"))
Vue.component("Calendar", () => import("./components/Calendar"))
Vue.component("CostsForm", () => import("./components/CostsForm"))
Vue.component("LoginForm", () => import("./components/LoginForm"))
Vue.component("CostsList", () => import("./components/CostsList"))
Vue.component("YearlyChart", () => import("./components/YearlyChart"))
Vue.component("Header", () => import("./components/Header"))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
