<style lang="scss">
@import "./Calendar.scss";
</style>
<template>
  <div :class="b()">
    <h3 :class="b('month')">
      <button @click="handleMonthChange($event, 'prev')" :class="b('toggler', ['prev'])">◀</button>
      {{ displayedMonth }}, {{ displayedYear }}
      <button @click="handleMonthChange($event, 'next')" :class="b('toggler', ['next'])">▶</button>
    </h3>
    <div :class="b('weekdays')">
      <div v-for="(day, i) in weekdays" :key="i" :class="b('weekday')">{{ day }}</div>
    </div>

    <div :class="b('days')">
      <Day v-for="day in mockDays" :key="day" />
      <Day
        v-for="(day, i) in daysOfMonth"
        :key="i"
        :day="day"
        :is-selected="isDateSelected(day)"
        @set-selected-day="setSelectedDate"
      />
    </div>
  </div>
</template>

<script>
import { times, compose, map } from "ramda"
import { getYear, format, getDaysInMonth, getISODay, setDate, subMonths, addMonths, formatISO } from "date-fns"

import BEM from "../../helpers/BEM"
import { WEEKDAYS } from "../../constants"

export default {
  props: { value: { type: String, default: () => "" } },
  data() {
    return {
      b: BEM("Calendar"),
      selectedDate: new Date(this.value),
      weekdays: WEEKDAYS
    }
  },
  watch: {
    value() {
      this.selectedDate = new Date(this.value)
    },
    selectedDate() {
      this.$emit("input", format(this.selectedDate, "yyyy-MM-dd"))
    }
  },
  methods: {
    isDateSelected(date) {
      return date.toString() === this.selectedDate.toString()
    },
    setSelectedDate(day) {
      this.selectedDate = new Date(day)
    },
    handleMonthChange(event, direction) {
      event.preventDefault()
      this.selectedDate = direction === "prev" ? subMonths(this.selectedDate, 1) : addMonths(this.selectedDate, 1)
    }
  },
  computed: {
    displayedYear() {
      return getYear(this.selectedDate)
    },
    displayedMonth() {
      return this.selectedDate && format(this.selectedDate, "MMMM")
    },
    daysOfMonth() {
      return compose(
        times(i => setDate(this.selectedDate, i + 1)),
        getDaysInMonth
      )(this.selectedDate)
    },
    mockDays() {
      return times(i => -i - 1, getISODay(setDate(this.selectedDate, 1)) - 1)
    }
  }
}
</script>
