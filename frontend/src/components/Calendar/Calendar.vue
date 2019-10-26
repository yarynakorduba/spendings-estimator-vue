<style lang="scss">
@import "./Calendar.scss";
</style>
<template>
  <div :class="b()">
    <h3 :class="b('month')">
      {{ displayedMonth }}, {{ selectedYear }}
      <button @click="handleMonthChange('prev')">◀</button>
      <button @click="handleMonthChange('next')">▶</button>
    </h3>
    <div :class="b('days')">
      <Day v-for="day in mockDays" :key="day" />
      <Day
        v-for="(day, index) in daysOfMonth"
        :key="index"
        :day="day"
        :is-selected="day == selectedDay"
        @set-selected-day="setSelectedDay"
      />
    </div>
  </div>
</template>

<script>
import BEM from "../../helpers/BEM"
import { times } from "ramda"
import {
  getYear,
  endOfMonth,
  format,
  getDaysInMonth,
  getISODay,
  startOfMonth,
  subMonths,
  addMonths,
  setDate,
  startOfToday
} from "date-fns"

export default {
  data() {
    return {
      b: BEM("Calendar"),
      selectedMonth: startOfMonth(new Date()),
      selectedDay: startOfToday().toString()
    }
  },
  methods: {
    setSelectedDay(day) {
      this.selectedDay = day
    },
    handleMonthChange(direction) {
      this.selectedMonth =
        direction === "prev"
          ? subMonths(this.selectedMonth, 1)
          : direction === "next"
          ? addMonths(this.selectedMonth, 1)
          : this.selectedMonth
    }
  },
  computed: {
    months() {
      return times(month => {
        const start = new Date(this.selectedYear, month, 1)
        return {
          start,
          end: endOfMonth(start)
        }
      }, 12)
    },
    selectedYear() {
      return getYear(this.selectedMonth)
    },
    displayedMonth() {
      return this.selectedMonth && format(this.selectedMonth, "MMMM")
    },
    daysOfMonth() {
      return times(
        index =>
          console.log("2019-10-25T22:00:00.000Z" === "2019-10-25T22:00:00.000Z") ||
          setDate(this.selectedMonth, index + 1),
        getDaysInMonth(this.selectedMonth)
      )
    },
    mockDays() {
      const firstDayOfMonth = getISODay(this.selectedMonth)
      return times(index => -index - 1, firstDayOfMonth - 1)
    }
  }
}
</script>
