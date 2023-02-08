export const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUNE",
  "JULY",
  "AUG",
  "SEPT",
  "OCT",
  "NOV",
  "DEC",
];

export const handleDate = (date: string) => {
  const locale = localStorage.getItem("locale") || "zh-CN";
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = dateObj.getFullYear();

  if (locale === "zh-CN") {
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");

    return `${day}.${month}.${year}`;
  } else {
    const month = monthNames[dateObj.getMonth()];
    const output = month + "\n" + day + ", " + year;
    return output;
  }
};
