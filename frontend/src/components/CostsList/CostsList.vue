<style lang="scss">
@import "./CostsList.scss";
</style>

<template>
  <table :class="b()">
    <tr :class="b('cost')" v-for="cost in costs" :key="cost._id">
      <td :class="b('purpose')">{{ cost.purpose }}</td>
      <td :class="b('amount')">{{ cost.amount }}</td>
    </tr>
  </table>
</template>

<script>
import { mapGetters } from "vuex"
import BEM from "../../helpers/BEM"
import { FETCH_COSTS } from "../../store/actionTypes"

export default {
  data() {
    return {
      b: BEM("CostsList")
    }
  },
  computed: {
    ...mapGetters({ costs: "getCosts" })
  },
  async mounted() {
    this.$store.dispatch(FETCH_COSTS)
  }
}
</script>
