const {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
} = require("date-fns");

function currentFullDateAsString() {
  return format(new Date(), "yyyy-MM-dd-HH-mm-ss");
}

function dateAsString(date) {
  return format(date, "yyyy-MM-dd-HH-mm-ss");
}

function dateAsHumanReadableString(date) {
  return format(date, "yyyy-MM-dd");
}

function currentMonth() {
  return new Date().getMonth() + 1; // JS months 0-11
}

function currentYear() {
  return new Date().getFullYear();
}

function month(date) {
  return date.getMonth() + 1;
}

function year(date) {
  return date.getFullYear();
}

function rangeOfMonth(monthParam, yearParam) {
  let firstDay, lastDay;
  if (monthParam && yearParam) {
    firstDay = startOfMonth(new Date(yearParam, monthParam - 1, 1));
    lastDay = endOfMonth(firstDay);
  } else {
    firstDay = startOfMonth(new Date());
    lastDay = endOfMonth(new Date());
  }
  return { firstDate: firstDay, lastDate: lastDay };
}

function rangeOfYear(yearParam) {
  let firstDay, lastDay;
  if (yearParam) {
    firstDay = startOfYear(new Date(yearParam, 0, 1));
    lastDay = endOfYear(firstDay);
  } else {
    firstDay = startOfYear(new Date());
    lastDay = endOfYear(new Date());
  }
  return { firstDate: firstDay, lastDate: lastDay };
}

// Returns range from start to end of given date
function rangeOfDay(dateTime) {
  const start = startOfDay(dateTime);
  const end = endOfDay(dateTime);
  return { start, end };
}

module.exports = {
  currentFullDateAsString,
  dateAsString,
  dateAsHumanReadableString,
  currentMonth,
  currentYear,
  month,
  year,
  rangeOfMonth,
  rangeOfYear,
  rangeOfDay,
};
