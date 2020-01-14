import { customFetch } from "./fetch";

export const addCost = cost => customFetch("api/costs", "POST", cost);
export const getCosts = year => customFetch(`api/costs/${year}`, "GET");

export const getCostYears = () => customFetch("api/costs/years", "GET");

export const signinUser = credentials => customFetch("api/users/signin", "POST", credentials);
export const signupUser = credentials => customFetch("api/users/signup", "POST", credentials);

export default {
  addCost,
  getCosts,
  getCostYears,
  signinUser,
  signupUser
};
