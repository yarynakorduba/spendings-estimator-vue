<style lang="scss">
@import "./CostsForm.scss";
</style>

<template>
  <form :class="b()">
    <input :class="b('costs')" name="costs" type="number" placeholder="$" />
    <input :class="b('purpose')" name="purpose" type="text" placeholder="What were these money spent for?" />
    <button :class="b('add')">Add</button>
  </form>
</template>

<script>
import BEM from "../../helpers/BEM"

export default {
  data() {
    return {
      b: BEM("CostsForm")
    }
  }
}
</script>

<style></style>
