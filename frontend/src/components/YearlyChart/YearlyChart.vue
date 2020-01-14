<style lang="scss">
@import "./YearlyChart.scss";
</style>

<template>
  <div :class="b()">
    <h2 :class="b('header')">Your spendings in this year</h2>
    <div :class="b('sum')">
      {{ displayedStart }} - {{ displayedEnd }}: {{ spentCosts }}<span v-if="spentCosts">$</span>
    </div>
    <div :class="b('container')"><svg :class="b('chart')" /></div>
    <div :class="b('years')">
      <button :class="b('year')" v-for="year in costYears" :key="year" @click="handleYearChange(year)">
        {{ year }}
      </button>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { costsMixin } from "../../mixins";
import { groupBy, reduce, prop, compose, isEmpty, map, times, filter, sum } from "ramda";
import {
  format,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  getISODay,
  subDays,
  isBefore,
  getDayOfYear,
  isWithinInterval
} from "date-fns";

import BEM from "../../helpers/BEM";
import { dateFormat, displayedDateFormat, weekdays, weekdaysList, monthsList } from "../../constants";
import { basicPalette, hoverPalette, selectedPalette, getColor } from "../../helpers/colors";

const chartWidth = 700;
const chartHeight = 130;
const cellWidth = 11;
const margin = 37;

export default {
  mixins: [costsMixin],
  data() {
    return {
      b: BEM("YearlyChart"),
      costsOfYear: [],
      isSelecting: false,
      field: null,
      year: startOfYear(new Date()),
      start: startOfYear(new Date()),
      end: endOfYear(new Date())
    };
  },
  computed: {
    displayedStart() {
      return this.start && format(this.start, displayedDateFormat);
    },
    displayedEnd() {
      return this.end && format(this.end, displayedDateFormat);
    },
    spentCosts() {
      return (
        this.start &&
        this.end &&
        compose(
          sum,
          map(prop("costsSum")),
          filter(({ date }) => isWithinInterval(new Date(date), { start: this.start, end: this.end }))
        )(this.daysOfYear)
      );
    },
    daysOfYear() {
      const groupedCosts = groupBy(({ date }) => format(new Date(date), dateFormat))(this.costsOfYear);
      return compose(
        map(dateString => {
          const date = new Date(dateString);
          return {
            date: format(date, dateFormat),
            costs: groupedCosts[format(date, dateFormat)] || [],
            costsSum: reduce((acc, { amount }) => acc + amount, 0, groupedCosts[format(date, dateFormat)] || [])
          };
        }),
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
    },
    year() {
      this.getCostsOfYear();
      this.drawChart();
    }
  },
  async mounted() {
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
    handleYearChange(year) {
      this.year = startOfYear(new Date(`${year}-01-01`));
      this.start = new Date(this.year);
      this.end = endOfYear(new Date(`${year}-01-01`));
    },
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
        .attr("id", d => !isBefore(new Date(d.date), new Date(this.year)) && d.date)
        .attr("class", d => this.b("day", [isBefore(new Date(d.date), new Date(this.year)) ? "mock" : d.date]))
        .style("fill", getColor(this.year, [this.minCosts, this.maxCosts]))
        .on("mouseenter", ({ date }) => {
          if (this.start && !this.end) {
            const range = {
              start: isBefore(this.start, new Date(date)) ? this.start : new Date(date),
              end: isBefore(this.start, new Date(date)) ? new Date(date) : this.start
            };

            d3.selectAll(`rect`).style("fill", x =>
              getColor(
                this.year,
                [this.minCosts, this.maxCosts],
                isWithinInterval(new Date(x.date), range) ? hoverPalette : basicPalette
              )(x)
            );
          }
        })
        .on("click", d => {
          const date = new Date(d.date);
          if (!this.isSelecting) {
            d3.selectAll(`rect`).style("fill", getColor(this.year, [this.minCosts, this.maxCosts]));
            this.start = date;
            this.end = null;
          } else {
            if (isBefore(date, this.start)) {
              this.end = this.start;
              this.start = date;
            } else {
              this.end = new Date(d.date);

              d3.selectAll(`rect`).style("fill", x =>
                isWithinInterval(new Date(x.date), { start: this.start, end: this.end })
                  ? getColor(this.year, [this.minCosts, this.maxCosts], selectedPalette)(x)
                  : getColor(this.year, [this.minCosts, this.maxCosts])(x)
              );
            }
          }
          this.isSelecting = !this.isSelecting;
        });
    },
    getCostsOfYear() {
      this.costsOfYear = this.getCosts(format(this.year, dateFormat), format(endOfYear(this.year), dateFormat));

      if (find(x => new Date(x) === new Date(this.year)) && isEmpty(this.costsOfYear)) {
        this.fetchCosts(this.year);
        this.costsOfYear = this.getCosts(format(this.year, dateFormat), format(endOfYear(this.year), dateFormat));
      }
    }
  }
};
</script>
