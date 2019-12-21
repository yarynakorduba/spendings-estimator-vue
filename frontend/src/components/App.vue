<template>
  <div id="app">
    <router-view class="app-container" />
  </div>
</template>

<script>
import decodeJWT from "jwt-decode"
import { mapGetters } from "vuex"
import { SET_USER_INFO } from "../store/actionTypes"

export default {
  computed: {
    ...mapGetters({ user: "getUser" })
  },
  mounted() {
    const jwtToken = localStorage.getItem("jwt")
    if (jwtToken) {
      const user = decodeJWT(jwtToken)
      this.$store.dispatch(SET_USER_INFO, user)
    }
  }
}
</script>
