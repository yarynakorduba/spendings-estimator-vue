<style lang="scss">
@import "./Header.scss";
</style>

<template>
  <nav :class="b()">
    <header :class="b('logo')">CostNote</header>
    <div :class="b('email')">{{ user.email }}</div>
    <button :class="b('logout')" @click="handleClick">Logout</button>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

import BEM from "../../helpers/BEM";

export default {
  data() {
    return {
      b: BEM("Header")
    };
  },
  computed: {
    ...mapGetters({ user: "getUser" })
  },
  methods: {
    handleClick() {
      localStorage.removeItem("jwt");
      this.$router.push("signin");
    }
  }
};
</script>
