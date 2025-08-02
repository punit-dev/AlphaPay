const isDateCurrent = (date) => {
  const today = new Date();

  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  const [expiryMonth, expiryYear] = date.split("/").map(Number);

  const givenYear = 2000 + parseInt(expiryYear, 10);
  const givenMonth = parseInt(expiryMonth, 10);
  const isYearExpired = givenYear < todayYear;
  if (isYearExpired) {
    return isYearExpired;
  }
  const isDateExpired = givenMonth <= todayMonth;
  return isDateExpired;
};

module.exports = isDateCurrent;
