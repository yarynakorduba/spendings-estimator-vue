import { customFetch } from "./fetch"

export const addCost = async cost => await customFetch("api/costs", "POST", cost)
export const getCosts = () => customFetch("api/costs", "GET")

export default {
  addCost,
  getCosts
}
