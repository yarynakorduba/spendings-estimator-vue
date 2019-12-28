import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/signin", name: "signin", component: () => import("../pages/Login") },
    { path: "/signup", name: "signup", component: () => import("../pages/Login") },
    { path: "/dashboard", name: "dashboard", component: () => import("../pages/Dashboard") },
    {
      path: "*",
      component: {
        template: "<div>Not found</div>"
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const jwtToken = localStorage.getItem("jwt");

  if ((to.path === "/signin" || to.path === "/") && jwtToken) next("/dashboard");
  else if (!jwtToken && to.path !== "/signin" && to.path !== "/signup") {
    next("/signin");
  } else next();
});

export default router;
