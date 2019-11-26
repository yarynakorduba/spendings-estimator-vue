<style lang="scss">
@import "./CostsForm.scss";
</style>

<template>
  <form :class="b()">
    <Calendar v-model="date" />
    <input :class="b('amount')" v-model="amount" name="amount" type="number" placeholder="$" />
    <input :class="b('purpose')" v-model="purpose" name="purpose" placeholder="What were these money spent for?" />
    <button :class="b('add')" @click="handleSubmit">Add</button>
  </form>
</template>

<script>
import { ADD_COST } from "../../store/actionTypes"
import BEM from "../../helpers/BEM"

export default {
  data() {
    return {
      b: BEM("CostsForm"),
      amount: 0,
      purpose: "",
      date: "2019-10-10"
    }
  },
  methods: {
    async handleSubmit(event) {
      event.preventDefault()
      console.log(this.$store)
      this.$store.dispatch(ADD_COST, { amount: this.amount, purpose: this.purpose, date: "2019-10-10" })
      this.amount = 0
      this.purpose = ""
    }
  }
}
</script>
