<style lang="scss">
@import "./Day.scss";
</style>

<template>
  <span :class="isSelected ? b(['selected']) : b()" @click="handleClick">
    {{ displayedDay }}
  </span>
</template>

<script>
import { format } from "date-fns"
import BEM from "../../helpers/BEM"

export default {
  props: ["day", "isSelected"],
  data() {
    return {
      b: BEM("Day")
    }
  },
  methods: {
    handleClick() {
      this.$emit("set-selected-day", this.day)
    }
  },
  computed: {
    displayedDay() {
      return this.day && format(this.day, "dd")
    }
  }
}
</script>

<style></style>
