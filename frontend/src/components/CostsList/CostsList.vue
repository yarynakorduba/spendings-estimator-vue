<style lang="scss">
@import "./CostsList.scss";
</style>

<template>
  <table :class="b()">
    <tr :class="b('cost')" v-for="cost in costsOfDate" :key="cost._id">
      <td :class="b('date')">{{ cost.date }}</td>
      <td :class="b('purpose')">{{ cost.purpose }}</td>
      <td :class="b('amount')">{{ cost.amount }}</td>
    </tr>
  </table>
</template>

<script>
import { mapGetters } from "vuex"
import { format } from "date-fns"
import BEM from "../../helpers/BEM"
import { FETCH_COSTS } from "../../store/actionTypes"

export default {
  data() {
    return {
      b: BEM("CostsList"),
      costsOfDate: []
    }
  },
  computed: {
    ...mapGetters({ user: "getUser", getCosts: "getCostsByDateRange" }),
    displayedCosts() {
      return this.costsOfDate.map(cost => ({ ...cost, date: format(new Date(cost.date), "dd/MM/yyyy") }))
    }
  },
  async mounted() {
    this.$root.$on("set-date", this.handleDateSetting)
    this.fetchCosts()
  },
  methods: {
    fetchCosts() {
      this.$store.dispatch(FETCH_COSTS)
    },
    handleDateSetting(date) {
      this.costsOfDate = this.getCosts(date, date)
    }
  }
}
</script>
