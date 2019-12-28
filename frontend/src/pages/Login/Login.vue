<style lang="scss">
@import "./Login.scss";
</style>

<template>
  <div :class="b()">
    <div :class="b('container')">
      <LoginForm />
    </div>
  </div>
</template>

<script>
import BEM from "../../helpers/BEM";

export default {
  data() {
    return {
      b: BEM("Login")
    };
  }
};
</script>
