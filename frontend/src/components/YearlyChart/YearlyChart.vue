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
  setMonth,
  setDate,
  setDay,
  getDayOfYear,
  isWithinInterval
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

const zeroColor = "";
const hoverZeroColor = "rgba(217, 193, 222, 0.7)";
const selectedZeroColor = "#d9c1de";

const hoverPalette = ["rgba(176, 89, 134, 0.8)", "rgba(104, 26, 31, 0.8)"];
const selectedPalette = ["#d479b9", "#681a1f"];

const getColor = d => (year, domain, range = ["#d9effc", "#0000A0"]) => {
  const sumOfCosts = reduce((acc, current) => acc + current.amount, 0, d.costs);
  if (isBefore(new Date(d.date), new Date(year))) {
    return "white";
  }
  return sumOfCosts === 0
    ? "rgb(235, 237, 240)"
    : d3
        .scaleLinear()
        .domain(domain)
        .range(range)(sumOfCosts);
};

export default {
  mixins: [costsMixin],
  data() {
    return {
      b: BEM("YearlyChart"),
      year: startOfYear(new Date()),
      costsOfYear: [],
      field: null,
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
      isSelecting: false
    };
  },
  computed: {
    displayedStart() {
      return this.start && format(this.start, "dd/MM/yyyy");
    },
    displayedEnd() {
      console.log(this.end);
      return this.end && format(this.end, "dd/MM/yyyy");
    },
    spentCosts() {
      return (
        this.start &&
        this.end &&
        compose(
          sum,
          map(prop("costsSum")),
          filter(day => isWithinInterval(new Date(day.date), { start: new Date(this.start), end: new Date(this.end) }))
        )(this.daysOfYear)
      );
    },
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
        .style("fill", d => {
          return getColor(d)(this.year, [this.minCosts, this.maxCosts]);
        })
        .on("mouseover", d => {
          if (!this.start) {
            d3.select(`rect[id="${d.date}"]`).style("fill", "yellow");
          }
        })
        .on("mouseenter", d => {
          if (this.start && !this.end) {
            d3.selectAll(`rect`).style("fill", x => {
              const range = isBefore(new Date(this.start), new Date(d.date))
                ? {
                    start: this.start,
                    end: new Date(d.date)
                  }
                : {
                    end: this.start,
                    start: new Date(d.date)
                  };
              if (isWithinInterval(new Date(x.date), range)) {
                return x.costsSum === 0
                  ? hoverZeroColor
                  : getColor(x)(this.year, [this.minCosts, this.maxCosts], hoverPalette);
              }
              return getColor(x)(this.year, [this.minCosts, this.maxCosts]);
            });
          }
        })
        .on("click", d => {
          const date = new Date(d.date);
          if (!this.isSelecting) {
            d3.selectAll(`rect`).style("fill", d => getColor(d)(this.year, [this.minCosts, this.maxCosts]));
            this.start = date;
            this.end = null;
          } else {
            if (isBefore(date, this.start)) {
              this.end = this.start;
              this.start = date;
            } else {
              this.end = new Date(d.date);

              d3.selectAll(`rect`).style("fill", x => {
                const range = { start: this.start, end: this.end };
                if (isWithinInterval(new Date(x.date), range)) {
                  return x.costsSum === 0
                    ? "#d9c1de"
                    : getColor(x)(this.year, [this.minCosts, this.maxCosts], selectedPalette);
                }
                return getColor(x)(this.year, [this.minCosts, this.maxCosts]);
              });
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
