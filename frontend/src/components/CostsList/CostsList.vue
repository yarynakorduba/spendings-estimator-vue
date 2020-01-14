<style lang="scss">
@import "./CostsList.scss";
</style>

<template>
  <div :class="b()">
    <h2 :class="b('header')">{{ date }}</h2>
    <table v-if="costsOfDate.length" :class="b()">
      <tr :class="b('cost')" v-for="cost in costsOfDate" :key="cost._id">
        <td :class="b('purpose')">{{ cost.purpose }}</td>
        <td :class="b('amount')">{{ cost.amount }}</td>
      </tr>
    </table>

    <div v-else :class="b('empty-message')">No costs today ^_^</div>
  </div>
</template>

<script>
import { format, startOfDay, endOfDay } from "date-fns";
import BEM from "../../helpers/BEM";
import { costsMixin } from "../../mixins";

import { displayedDateFormat, dateFormat } from "../../constants";

export default {
  mixins: [costsMixin],
  data() {
    return {
      b: BEM("CostsList"),
      costsOfDate: [],
      date: null
    };
  },
  watch: {
    areCostsLoading() {
      this.getCostsOfDay();
    },
    date() {
      this.getCostsOfDay();
    }
  },
  computed: {
    displayedCosts() {
      return this.costsOfDate.map(cost => ({ ...cost, date: format(new Date(cost.date), displayedDateFormat) }));
    }
  },
  mounted() {
    this.$root.$on("set-date", this.handleDateSetting);
    this.handleDateSetting(format(new Date(), dateFormat));
  },
  methods: {
    handleDateSetting(date) {
      this.date = date;
    },
    getCostsOfDay() {
      this.costsOfDate = this.getCosts(this.date, this.date);
    }
  }
};
</script>
