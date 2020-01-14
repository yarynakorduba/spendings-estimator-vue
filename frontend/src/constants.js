import { setDay, setDate, setMonth } from "date-fns";

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const dateFormat = "yyyy-MM-dd";

export const displayedDateFormat = "dd/MM/yyyy";

export const weekdays = 7;
export const weekdaysList = new Array(7).fill(1).map((val, i) => setDay(new Date(), i + 1));
export const monthsList = new Array(12).fill(1).map((val, i) => setMonth(setDate(new Date(), 1), i + 1));
