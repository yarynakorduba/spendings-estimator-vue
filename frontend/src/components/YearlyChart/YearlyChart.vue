<style lang="scss">
@import "./YearlyChart.scss";
</style>

<template>
  <div :class="b()">
    <h2 :class="b('header')">Your spendings in this year</h2>
    <div :class="b('container')"><svg :class="b('year')" /></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { costsMixin } from "../../mixins";
import { groupBy, reduce, prop, compose, isEmpty, map, times } from "ramda";
import {
  format,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  getISODay,
  subDays,
  isBefore,
  setMonth,
  setDate,
  setDay,
  getDayOfYear
} from "date-fns";

import BEM from "../../helpers/BEM";
import { dateFormat } from "../../constants";

const weekdays = 7;
const weekdaysList = new Array(7).fill(1).map((val, i) => setDay(new Date(), i + 1));
const monthsList = new Array(12).fill(1).map((val, i) => setMonth(setDate(new Date(), 1), i + 1));

const chartWidth = 700;
const chartHeight = 130;
const cellWidth = 11;
const margin = 37;

export default {
  mixins: [costsMixin],
  data() {
    return {
      b: BEM("YearlyChart"),
      year: startOfYear(new Date()),
      costsOfYear: [],
      field: null
    };
  },
  computed: {
    daysOfYear() {
      const groupedCosts = groupBy(cost => format(new Date(cost.date), dateFormat))(this.costsOfYear);
      return compose(
        map(date => ({
          date: format(new Date(date), dateFormat),
          costs: groupedCosts[format(new Date(date), dateFormat)] || [],
          costsSum: reduce((acc, { amount }) => acc + amount, 0, groupedCosts[format(new Date(date), dateFormat)] || [])
        })),
        year => eachDayOfInterval({ start: year, end: endOfYear(year) })
      )(this.year);
    },
    minCosts() {
      return !isEmpty(this.daysOfYear) ? compose(d3.min, map(prop("costsSum")))(this.daysOfYear) : 0;
    },
    maxCosts() {
      return !isEmpty(this.daysOfYear) ? compose(d3.max, map(prop("costsSum")))(this.daysOfYear) : 0;
    },
    mockDays() {
      return times(
        day => ({
          date: format(subDays(new Date(this.year), day + 1), dateFormat),
          costs: [],
          costsSum: 0
        }),
        getISODay(new Date(this.year))
      );
    }
  },
  watch: {
    areCostsLoading() {
      this.getCostsOfYear();
      this.drawChart();
    }
  },
  mounted() {
    this.getCostsOfYear();

    const container = d3
      .select("svg")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    this.field = container.append("g").attr("transform", "translate(30, 30)");

    container
      .append("g")
      .selectAll("text")
      .data(weekdaysList)
      .join("text")
      .attr("class", () => this.b("weekday"))
      .attr("y", (d, i) => (i % weekdays) * cellWidth + margin)
      .text(d => format(d, "EEE"));

    container
      .append("g")
      .attr("class", () => this.b("month-container"))
      .selectAll("text")
      .data(monthsList)
      .join("text")
      .text(d => format(d, "MMM"))
      .attr("class", () => this.b("month"))
      .attr("x", (d, i) => Math.floor(getDayOfYear(d) / weekdays) * cellWidth)
      .attr("y", () => 10);

    this.drawChart();
  },
  methods: {
    drawChart() {
      this.field.enter().remove();
      this.field
        .selectAll("rect")
        .enter()
        .append("rect")
        .data([...this.mockDays, ...this.daysOfYear])
        .join("rect")
        .attr("x", (d, i) => Math.floor(i / weekdays) * cellWidth)
        .attr("y", (d, i) => (i % weekdays) * cellWidth)
        .attr("class", d => this.b("day", [isBefore(new Date(d.date), new Date(this.year)) ? "mock" : d.date]))
        .style("fill", this.getColor)
        .on("click", d => console.log(d));
    },
    getCostsOfYear() {
      this.costsOfYear = this.getCosts(format(this.year, dateFormat), format(endOfYear(this.year), dateFormat));
    },
    getColor(d) {
      const sumOfCosts = reduce((acc, current) => acc + current.amount, 0, d.costs);
      if (isBefore(new Date(d.date), new Date(this.year))) {
        return "white";
      }
      return sumOfCosts === 0
        ? "rgb(235, 237, 240)"
        : d3
            .scaleLinear()
            .domain([this.minCosts, this.maxCosts])
            .range(["#d9effc", "#0000A0"])(sumOfCosts);
    }
  }
};
</script>
