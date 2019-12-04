<style lang="scss">
@import "./Header.scss";
</style>

<template>
  <nav :class="b()">
    <header :class="b('logo')">CostNote</header>
  </nav>
</template>

<script>
import BEM from "../../helpers/BEM"

export default {
  data() {
    return {
      b: BEM("Header")
    }
  }
}
</script>
