import { mapGetters, mapState } from "vuex";
import { FETCH_COSTS } from "../store/actionTypes";

export const costsMixin = {
  computed: {
    ...mapGetters({
      user: "getUser",
      getAllCosts: "getCosts",
      getCostsObject: "getCostsObjectByDateRange",
      getCosts: "getCostsByDateRange",
      areCostsLoading: "areCostsLoading"
    }),
    ...mapState(["costs"])
  },
  mounted() {
    if (!this.costs.ids.length && typeof this.areCostsLoading === "boolean" && !this.areCostsLoading) {
      this.fetchCosts();
    }
  },
  methods: {
    fetchCosts() {
      this.$store.dispatch(FETCH_COSTS);
    }
  }
};
