<style lang="scss">
@import "./CostsForm.scss";
</style>

<template>
  <form :class="b()">
    <Calendar v-model="date" />
    <input :class="b('amount')" v-model="amount" name="amount" type="number" placeholder="$45" />
    <input :class="b('purpose')" v-model="purpose" name="taxi" placeholder="Purpose" />
    <button :class="b('add')" @click="handleSubmit">Add</button>
    <div :class="b('error')">{{ error }}</div>
  </form>
</template>

<script>
import { formatISO } from "date-fns";
import { ADD_COST } from "../../store/actionTypes";
import BEM from "../../helpers/BEM";

export default {
  data() {
    return {
      b: BEM("CostsForm"),
      amount: "",
      purpose: "",
      date: formatISO(new Date()),
      error: ""
    };
  },
  watch: {
    date() {
      this.$root.$emit("set-date", this.date);
    }
  },
  methods: {
    async handleSubmit(event) {
      event.preventDefault();
      if (!this.amount || !this.purpose) {
        this.error = "Please, fill in amount and purpose of the costs :)";
      } else {
        this.$store.dispatch(ADD_COST, { amount: this.amount, purpose: this.purpose, date: this.date });
        this.amount = 0;
        this.purpose = "";
      }
    }
  }
};
</script>
