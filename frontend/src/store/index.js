import Vue from "vue"
import Vuex from "vuex"

import cost from "./cost.module"

Vue.use(Vuex)

export default new Vuex.Store({ modules: { cost } })
