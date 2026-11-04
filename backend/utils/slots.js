/*
  Helpers for date / time-slot handling.

  Slots are whole hours between OPEN_HOUR and CLOSE_HOUR.
  A booking from "10:00" to "13:00" occupies the hours 10, 11 and 12.
*/

const APP_TZ = process.env.APP_TZ || "Asia/Kolkata";
const OPEN_HOUR = Number(process.env.OPEN_HOUR || 8);
const CLOSE_HOUR = Number(process.env.CLOSE_HOUR || 22);
const MAX_HOURS_PER_BOOKING = 8;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):00$/;

const isValidDateKey = (value) => {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
};

const isValidTime = (value) => typeof value === "string" && TIME_RE.test(value);

const hourOf = (time) => Number(time.slice(0, 2));

const hoursBetween = (startTime, endTime) => {
  const list = [];
  for (let h = hourOf(startTime); h < hourOf(endTime); h += 1) list.push(h);
  return list;
};

const dateKeyToDate = (dateKey) => new Date(`${dateKey}T00:00:00.000Z`);

/* Current calendar day + hour in the business time zone */
const nowInTz = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const get = (type) => parts.find((p) => p.type === type).value;

  return {
    dateKey: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")),
  };
};

/* Hours of `dateKey` that are already in the past */
const pastHours = (dateKey) => {
  const now = nowInTz();
  const all = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h += 1) all.push(h);

  if (dateKey < now.dateKey) return all;
  if (dateKey > now.dateKey) return [];
  return all.filter((h) => h <= now.hour);
};

module.exports = {
  APP_TZ,
  OPEN_HOUR,
  CLOSE_HOUR,
  MAX_HOURS_PER_BOOKING,
  isValidDateKey,
  isValidTime,
  hourOf,
  hoursBetween,
  dateKeyToDate,
  nowInTz,
  pastHours,
};
