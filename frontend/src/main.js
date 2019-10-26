import Vue from "vue"
import App from "./App.vue"

Vue.config.productionTip = false
Vue.component("Day", () => import("./components/Day"))
Vue.component("Calendar", () => import("./components/Calendar"))

new Vue({
  render: h => h(App)
}).$mount("#app")
