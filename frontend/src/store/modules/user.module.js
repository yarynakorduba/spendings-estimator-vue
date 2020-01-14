import {
  SIGNIN_USER_START,
  SIGNIN_USER_ERROR,
  SIGNIN_USER_SUCCESS,
  SIGNUP_USER_START,
  SIGNUP_USER_ERROR,
  SIGNUP_USER_SUCCESS,
  SET_USER_INFO_SUCCESS
} from "../mutationTypes";

import { SIGNIN_USER, SIGNUP_USER, SET_USER_INFO } from "../actionTypes";

import Api from "../../api";

export default {
  state: { email: "", isLoading: false, error: "" },
  mutations: {
    [SIGNIN_USER_START]: state => {
      state.isLoading = true;
    },
    [SIGNIN_USER_ERROR]: (state, error) => {
      state.isLoading = false;
      state.error = error;
    },
    [SIGNIN_USER_SUCCESS]: (state, user) => {
      state.email = user.email;
      state.isLoading = false;
    },
    [SIGNUP_USER_START]: state => {
      state.isLoading = true;
    },
    [SIGNUP_USER_ERROR]: (state, error) => {
      state.isLoading = false;
      state.error = error;
    },
    [SIGNUP_USER_SUCCESS]: (state, user) => {
      state.email = user.email;
      state._id = user._id;
      state.isLoading = false;
    },
    [SET_USER_INFO_SUCCESS]: (state, user) => {
      state.email = user.email;
      state._id = user._id;
      state.isLoading = false;
    }
  },
  actions: {
    [SIGNUP_USER]: async (context, { router, ...payload }) => {
      context.commit(SIGNUP_USER_START);
      const result = await Api.signupUser(payload);
      if (result.success) {
        context.commit(SIGNUP_USER_SUCCESS, result.user);
        return router.push("/dashboard");
      }
      return context.commit(SIGNUP_USER_ERROR, result.error);
    },
    [SIGNIN_USER]: async (context, { router, ...payload }) => {
      context.commit(SIGNIN_USER_START);
      const result = await Api.signinUser(payload);

      if (result.success) {
        context.commit(SIGNIN_USER_SUCCESS, result.user);
        return router.push("/dashboard");
      }
      return context.commit(SIGNIN_USER_ERROR, result.error);
    },
    [SET_USER_INFO]: async (context, payload) => {
      context.commit(SET_USER_INFO_SUCCESS, payload);
    }
  },
  getters: {
    getUser: state => state,
    error: state => state.error
  }
};
