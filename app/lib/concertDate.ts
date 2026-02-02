const concertDate = (data: string) => {
  const getDate = new Date(data);

  const Month = new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(getDate);
  const Day = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
  }).format(getDate);
  const Year = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
  }).format(getDate);

  return [Year, Month, Day];
};

export default concertDate;
