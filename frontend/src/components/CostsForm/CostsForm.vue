<style lang="scss">
@import "./CostsForm.scss";
</style>

<template>
  <form :class="b()">
    <Calendar v-model="date" />
    <input :class="b('amount')" v-model="amount" name="amount" type="number" placeholder="$12345" />
    <input :class="b('purpose')" v-model="purpose" name="purpose" placeholder="Purpose" />
    <button :class="b('add')" @click="handleSubmit">Add</button>
  </form>
</template>

<script>
import { format } from "date-fns"
import { ADD_COST } from "../../store/actionTypes"
import BEM from "../../helpers/BEM"

export default {
  data() {
    return {
      b: BEM("CostsForm"),
      amount: 0,
      purpose: "",
      date: format(new Date(), "yyyy-MM-dd")
    }
  },
  watch: {
    date() {
      this.$root.$emit("set-date", this.date)
    }
  },
  methods: {
    async handleSubmit(event) {
      event.preventDefault()
      this.$store.dispatch(ADD_COST, { amount: this.amount, purpose: this.purpose, date: this.date })
      this.amount = 0
      this.purpose = ""
    }
  }
}
</script>
