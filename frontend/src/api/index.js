import { customFetch } from "./fetch"

export const addCost = cost => customFetch("api/costs", "POST", cost)
export const getCosts = () => customFetch("api/costs", "GET")
export const signinUser = credentials => customFetch("api/users/signin", "POST", credentials)
export const signupUser = credentials => customFetch("api/users/signup", "POST", credentials)

export default {
  addCost,
  getCosts,
  signinUser,
  signupUser
}
