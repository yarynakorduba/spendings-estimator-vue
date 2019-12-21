<style lang="scss">
@import "./YearlyChart.scss";
</style>

<template>
  <div :class="b()">
    <h2 :class="b('header')">Yearly Chart</h2>
    <svg :class="b('year')" />
  </div>
</template>

<script>
import * as d3 from "d3"
import { mapState } from "vuex"
import { costsMixin } from "../../mixins"
import { groupBy, reduce, prop, compose, isEmpty, map } from "ramda"
import { format, startOfYear, endOfYear, eachDayOfInterval } from "date-fns"

import BEM from "../../helpers/BEM"

export default {
  mixins: [costsMixin],
  data() {
    return {
      b: BEM("YearlyChart"),
      year: startOfYear(new Date()),
      costsOfYear: [],
      field: null
    }
  },
  computed: {
    ...mapState(["costs"]),
    daysOfYear() {
      const days = eachDayOfInterval({ start: this.year, end: endOfYear(this.year) })
      const groupedCosts = groupBy(cost => format(new Date(cost.date), "yyyy-MM-dd"))(this.costsOfYear)
      const result = days.map(date => ({
        date: format(new Date(date), "yyyy-MM-dd"),
        costs: groupedCosts[format(new Date(date), "yyyy-MM-dd")] || [],
        costsSum: reduce((acc, { amount }) => acc + amount, 0, groupedCosts[format(new Date(date), "yyyy-MM-dd")] || [])
      }))

      return result
    },
    minCosts() {
      return !isEmpty(this.daysOfYear) ? compose(d3.min, map(prop("costsSum")))(this.daysOfYear) : 0
    },
    maxCosts() {
      return !isEmpty(this.daysOfYear) ? compose(d3.max, map(prop("costsSum")))(this.daysOfYear) : 0
    }
  },
  watch: {
    areCostsLoading() {
      this.getCostsOfYear()
      this.drawChart()
    }
  },
  mounted() {
    this.getCostsOfYear()

    this.field = d3
      .select("svg")
      .attr("width", "700px")
      .attr("height", "100px")
      .append("g")
    this.drawChart()
  },
  methods: {
    drawChart() {
      this.field.enter().remove()
      this.field
        .selectAll("rect")
        .enter()
        .append("rect")
        .data(this.daysOfYear)
        .join("rect")
        .attr("x", (d, i) => Math.floor(i / 7) * 11)
        .attr("y", (d, i) => (i % 7) * 11)
        .attr("class", d => this.b("day", [d.date]))
        .style("fill", d => this.getColor(d))
        .on("click", d => console.log(d))
    },
    getCostsOfYear() {
      this.costsOfYear = this.getCosts(format(this.year, "yyyy-MM-dd"), format(endOfYear(this.year), "yyyy-MM-dd"))
    },
    getColor(d) {
      const sumOfCosts = reduce((acc, current) => acc + current.amount, 0, d.costs)
      return d3
        .scaleLinear()
        .domain([this.minCosts, this.maxCosts])
        .range(["#d9effc", "#0000A0"])(sumOfCosts)
    }
  }
}
</script>
