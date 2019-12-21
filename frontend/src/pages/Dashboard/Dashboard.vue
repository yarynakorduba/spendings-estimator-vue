<style lang="scss">
@import "./Dashboard";
</style>

<template>
  <div id="app" :class="b()">
    <Header />
    <div :class="b('container')">
      <CostsForm />
      <CostsList />
    </div>
  </div>
</template>

<script>
import BEM from "../../helpers/BEM"

export default {
  data() {
    return {
      b: BEM("Dashboard")
    }
  },
  mounted() {
    console.log(this)
  }
}
</script>
