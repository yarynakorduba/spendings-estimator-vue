<style lang="scss">
@import "./LoginForm.scss";
</style>

<template>
  <form>
    <input :class="b('email')" v-model="email" name="amount" type="email" placeholder="jannet.doe@gmail.com" />
    <input :class="b('password')" v-model="password" name="purpose" type="password" placeholder="keenPassword" />
    <button :class="b('signin')" @click="handleSubmit('signin')">Sign in</button>
    <button :class="b('signup')" @click="handleSubmit('signup')">Sign up</button>
  </form>
</template>

<script>
import BEM from "../../helpers/BEM"
import { SIGNIN_USER, SIGNUP_USER } from "../../store/actionTypes"

export default {
  data() {
    return {
      b: BEM("Login"),
      email: "admin",
      password: "admin"
    }
  },
  methods: {
    async handleSubmit(type) {
      event.preventDefault()
      const action = type === "signup" ? SIGNUP_USER : SIGNIN_USER
      await this.$store.dispatch(action, {
        email: this.email,
        password: this.password,
        date: "2019-10-10",
        router: this.$router
      })
      this.email = 0
      this.password = ""
    }
  }
}
</script>
