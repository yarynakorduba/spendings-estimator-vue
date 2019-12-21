<style lang="scss">
@import "./Header.scss";
</style>

<template>
  <nav :class="b()">
    <header :class="b('logo')">CostNote</header>
    <div :class="b('email')">{{ user.email }}</div>
  </nav>
</template>

<script>
import { mapGetters } from "vuex"

import BEM from "../../helpers/BEM"

export default {
  data() {
    return {
      b: BEM("Header")
    }
  },
  computed: {
    ...mapGetters({ user: "getUser" })
  }
}
</script>
