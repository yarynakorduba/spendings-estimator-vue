<style lang="scss">
@import "./Day.scss";
</style>

<template>
  <span :class="customClass" @click="handleClick">
    {{ displayedDay }}
  </span>
</template>

<script>
import { filter } from "ramda";
import { format } from "date-fns";
import BEM from "../../helpers/BEM";

export default {
  props: ["day", "isSelected", "hasCosts"],
  data() {
    return {
      b: BEM("Day")
    };
  },
  methods: {
    handleClick() {
      this.$emit("set-selected-day", this.day);
    }
  },
  computed: {
    customClass() {
      let modifiers = filter(el => el.length, [this.isSelected ? "selected" : "", this.hasCosts ? "has-costs" : ""]);
      return modifiers.length ? this.b(modifiers) : this.b();
    },

    displayedDay() {
      return this.day && format(this.day, "dd");
    }
  }
};
</script>

<style></style>
