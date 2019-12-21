import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/login", name: "login", component: () => import("../pages/Login") },
    { path: "/dashboard", name: "dashboard", component: () => import("../pages/Dashboard") },
    {
      path: "*",
      component: {
        template: "<div>Not found</div>"
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const jwtToken = localStorage.getItem("jwt")

  if (to.path === "/login" && jwtToken) next("/dashboard")
  else if (!jwtToken && to.path !== "/login") {
    next("/login")
  } else next()
})

export default router
