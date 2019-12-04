<style lang="scss">
@import "../../../styles/index.scss";
@import "./App.scss";
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
  name: "app",
  data() {
    return {
      b: BEM("App")
    }
  }
}
</script>
