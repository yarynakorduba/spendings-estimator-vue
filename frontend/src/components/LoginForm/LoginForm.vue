<style lang="scss">
@import "./LoginForm.scss";
</style>

<template>
  <form :class="b()">
    <input :class="b('email')" v-model="email" name="amount" type="email" placeholder="jannet.doe@gmail.com" />
    <input :class="b('password')" v-model="password" name="purpose" type="password" placeholder="keenPassword" />
    <button v-if="isSignUp" :class="b('signup')" @click="handleSubmit">Sign up</button>
    <button v-else :class="b('signin')" @click="handleSubmit">Sign in</button>
                                                    <small v-if="isSignUp" :class="b('message')"
      >Already have an account? <a :class="b('signin-link')" href="/signin">Sign in</a> here :)</small
    >
    <small v-else :class="b('message')"
      >Don't have an account yet? <a :class="b('signup-link')" href="/signup">Sign up</a> here :)</small
    >
  </form>
</template>

<script>
import BEM from "../../helpers/BEM";
import { SIGNIN_USER, SIGNUP_USER } from "../../store/actionTypes";

export default {
  data() {
    return {
      b: BEM("LoginForm"),
      email: "admin",
      password: "admin"
    };
  },
  computed: {
    isSignUp() {
      return this.$route.name === "signup";
    }
  },
  methods: {
    async handleSubmit() {
      event.preventDefault();
      const action = this.isSignUp ? SIGNUP_USER : SIGNIN_USER;
      await this.$store.dispatch(action, {
        email: this.email,
        password: this.password,
        router: this.$router
      });
      this.email = 0;
      this.password = "";
    }
  }
};
</script>
