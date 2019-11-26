<style lang="scss">
@import "./App.scss";
</style>

<template>
  <div id="app" :class="b()">
    <CostsForm />
    <CostsList />
  </div>
</template>

<script>
import BEM from "../../helpers/BEM"

export default {
  name: "app",
  data() {
    return {
      b: BEM("App")
    }
  }
}
</script>
