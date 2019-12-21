import { mapGetters, mapState } from "vuex"
import { FETCH_COSTS } from "../store/actionTypes"

export const costsMixin = {
  computed: {
    ...mapGetters({ user: "getUser", getCosts: "getCostsByDateRange", areCostsLoading: "areCostsLoading" }),
    ...mapState(["costs"])
  },
  mounted() {
    this.fetchCosts()
  },
  methods: {
    fetchCosts() {
      this.$store.dispatch(FETCH_COSTS)
    }
  }
}
