function formatDate(date) {
  const dateObj = new Date(date);
  return `${(`0${dateObj.getDate()}`).slice(-2)}/${(`0${dateObj.getMonth() + 1}`).slice(-2)}/${
    dateObj.getFullYear()} ${(`0${dateObj.getHours()}`).slice(-2)}:${(`0${dateObj.getMinutes()}`).slice(-2)}`;
}

export default formatDate;
