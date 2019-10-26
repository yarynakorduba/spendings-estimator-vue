import Vue from "vue"
import App from "./components/App"

Vue.config.productionTip = false
Vue.component("Day", () => import("./components/Day"))
Vue.component("Calendar", () => import("./components/Calendar"))
Vue.component("CostsForm", () => import("./components/CostsForm"))
Vue.component("CostsLists", () => import("./components/CostsList"))

new Vue({
  render: h => h(App)
}).$mount("#app")
