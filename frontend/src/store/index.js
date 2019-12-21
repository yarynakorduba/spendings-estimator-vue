import Vue from "vue"
import Vuex from "vuex"

import costs from "./modules/cost.module"
import user from "./modules/user.module"

Vue.use(Vuex)

export default new Vuex.Store({ modules: { costs, user } })
