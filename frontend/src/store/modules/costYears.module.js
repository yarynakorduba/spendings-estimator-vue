import Api from "../../api";
import { FETCH_COST_YEARS } from "../actionTypes";
import { FETCH_COST_YEARS_START, FETCH_COST_YEARS_ERROR, FETCH_COST_YEARS_SUCCESS } from "../mutationTypes";

export default {
  state: {
    list: [],
    isLoading: false
  },
  mutations: {
    [FETCH_COST_YEARS_START]: state => {
      state.isLoading = true;
    },
    [FETCH_COST_YEARS_SUCCESS]: (state, years) => {
      state.list = years;
      state.isLoading = false;
    },
    [FETCH_COST_YEARS_ERROR]: state => {
      state.isLoading = false;
    }
  },
  actions: {
    [FETCH_COST_YEARS]: async context => {
      context.commit(FETCH_COST_YEARS_START);
      const result = await Api.getCostYears();
      return result.success
        ? context.commit(FETCH_COST_YEARS_SUCCESS, result.years)
        : context.commit(FETCH_COST_YEARS_ERROR, result);
    }
  },
  getters: {
    getCostYears: state => console.log(state) || state.list,
    areCostYearsLoading: state => state.isLoading
  }
};
