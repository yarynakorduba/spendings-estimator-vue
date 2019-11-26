<style lang="scss">
@import "./CostsList.scss";
</style>

<template>
  <ul>
    {{
      costs
    }}
  </ul>
</template>

<script>
import { mapGetters } from "vuex"
import { FETCH_COSTS } from "../../store/actionTypes"

export default {
  computed: {
    ...mapGetters({ costs: "getCosts" })
  },
  async mounted() {
    this.$store.dispatch(FETCH_COSTS)
  }
}
</script>

<style></style>
