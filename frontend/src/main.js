import Vue from "vue"
import App from "./components/App"

import store from "./store"

Vue.config.productionTip = false
Vue.component("Day", () => import("./components/Day"))
Vue.component("Calendar", () => import("./components/Calendar"))
Vue.component("CostsForm", () => import("./components/CostsForm"))
Vue.component("CostsList", () => import("./components/CostsList"))
Vue.component("Header", () => import("./components/Header"))

new Vue({
  store,
  render: h => h(App)
}).$mount("#app")
