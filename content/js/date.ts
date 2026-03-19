function formatTimeSince(from: Date, mode: string): string {
  const today = new Date();

  let years = today.getFullYear() - from.getFullYear();
  let months = today.getMonth() - from.getMonth();
  let days = today.getDate() - from.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  switch (mode) {
    case "years":
      return `${years}`;
    case "ym":
      return `${years}y ${months}m`;
    case "full":
      return `${years}y, ${months}m, ${days}d`;
    default:
      return `${years} years`;
  }
}

function updateDates() {
  const data = document.querySelectorAll("date[data]"); 

  data.forEach((d) => {
    const dateStr = d.getAttribute("data");
    const mode = d.getAttribute("mode") || "years";

    if (!dateStr) return;

    const fromDate = new Date(dateStr);
    if (isNaN(fromDate.getTime())) return;

    d.textContent = formatTimeSince(fromDate, mode);
  });
}

document.addEventListener("DOMContentLoaded", updateDates);

export{};