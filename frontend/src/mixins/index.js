import { mapGetters, mapState } from "vuex";
import { startOfYear } from "date-fns";
import { FETCH_COSTS, FETCH_COST_YEARS } from "../store/actionTypes";

export const costsMixin = {
  computed: {
    ...mapGetters({
      user: "getUser",
      getAllCosts: "getCosts",
      costYears: "getCostYears",
      areCostYearsLoading: "areCostYearsLoading",
      getCostsObject: "getCostsObjectByDateRange",
      getCosts: "getCostsByDateRange",
      areCostsLoading: "areCostsLoading"
    }),
    ...mapState(["costs"])
  },
  mounted() {
    if (!this.costs.ids.length && typeof this.areCostsLoading === "boolean" && !this.areCostsLoading) {
      this.fetchCosts(startOfYear(new Date()));
    }
    if (!this.costYears.list && typeof this.areCostYearsLoading === "boolean" && !this.areCostYearsLoading) {
      this.fetchCostYears();
    }
  },
  methods: {
    fetchCosts(year) {
      this.$store.dispatch(FETCH_COSTS, year);
    },
    fetchCostYears() {
      this.$store.dispatch(FETCH_COST_YEARS);
    }
  }
};
