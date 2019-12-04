import { map, prop, indexBy } from "ramda"
import Api from "../api"
import { ADD_COST, FETCH_COSTS } from "./actionTypes"
import {
  ADD_COST_START,
  ADD_COST_ERROR,
  ADD_COST_SUCCESS,
  FETCH_COSTS_START,
  FETCH_COSTS_SUCCESS,
  FETCH_COSTS_ERROR
} from "./mutationTypes"

const cost = {
  state: {
    byId: {},
    ids: [],
    isLoading: []
  },
  mutations: {
    [ADD_COST_START]: state => {
      state.isLoading = true
    },
    [ADD_COST_ERROR]: state => {
      state.isLoading = false
    },
    [ADD_COST_SUCCESS]: (state, cost) => {
      //for direct interaction with the store module
      state.byId[cost._id] = cost
      state.ids = [...state.ids, cost._id]
      state.isLoading = false
    },
    [FETCH_COSTS_START]: state => {
      state.isLoading = true
    },
    [FETCH_COSTS_ERROR]: state => {
      state.isLoading = false
    },
    [FETCH_COSTS_SUCCESS]: (state, costs) => {
      //for direct interaction with the store module
      state.byId = indexBy(prop("_id"), costs)
      state.ids = map(prop("_id"), costs)
      state.isLoading = false
    }
  },
  actions: {
    [FETCH_COSTS]: async context => {
      context.commit(FETCH_COSTS_START)
      const result = await Api.getCosts()
      return result.success
        ? context.commit(FETCH_COSTS_SUCCESS, result.costs)
        : context.commit(FETCH_COSTS_ERROR, result)
    },
    [ADD_COST]: async (context, payload) => {
      context.commit(ADD_COST_START)
      const result = await Api.addCost(payload)
      return result.error ? context.commit(ADD_COST_ERROR, result) : context.commit(ADD_COST_SUCCESS, result)
    }
  },
  getters: {
    getIds: ({ ids }) => ids,
    getCostById: ({ byId }) => id => byId[id],
    getCosts: (state, getters) => map(id => getters.getCostById(id), state.ids)
  }
}

export default cost
