import * as d3 from "d3";
import { reduce } from "ramda";
import { isBefore } from "date-fns";

export const basicPalette = ["rgb(235, 237, 240)", "#d9effc", "#0000A0"];
export const hoverPalette = ["rgba(217, 193, 222, 0.7)", "rgba(176, 89, 134, 0.8)", "rgba(104, 26, 31, 0.8)"];
export const selectedPalette = ["#d9c1de", "#d479b9", "#681a1f"];

export const getColor = (year, domain, range = basicPalette) => d => {
  const sumOfCosts = reduce((acc, current) => acc + current.amount, 0, d.costs);
  if (isBefore(new Date(d.date), new Date(year))) {
    return "white";
  }
  const [basicColor, ...palette] = range;
  return sumOfCosts === 0
    ? basicColor
    : d3
        .scaleLinear()
        .domain(domain)
        .range(palette)(sumOfCosts);
};
