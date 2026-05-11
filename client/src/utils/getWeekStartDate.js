const getWeekStartDate = (date) => {

  const selectedDate = new Date(date);

  const day = selectedDate.getDay();

  const diff =
    selectedDate.getDate() -
    day +
    (day === 0 ? -6 : 1);

  const monday = new Date(selectedDate);

  monday.setDate(diff);

  return monday
    .toISOString()
    .split("T")[0];
};

export default getWeekStartDate;