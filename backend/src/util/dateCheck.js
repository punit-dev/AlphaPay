const isDateCurrent = (date) => {
  const today = new Date();

  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  const [expiryMonth, expiryYear] = date.split("/").map(Number);

  const givenYear = 2000 + parseInt(expiryYear, 10);
  const givenMonth = parseInt(expiryMonth, 10);

  const isExpired = givenMonth === todayMonth && givenYear === todayYear;

  return isExpired;
};

module.exports = isDateCurrent;
