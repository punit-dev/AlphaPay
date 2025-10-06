/**
 * Checks if a given expiry date (in MM/YY format) is expired compared to the current date.
 *
 * @param {string} date - Expiry date in the format "MM/YY" (e.g., "08/25").
 * @returns {boolean} - Returns true if the date is expired, false if still valid.
 *
 * Logic:
 * 1. Get today's month and year.
 * 2. Parse expiry month and year from the given date string.
 * 3. Convert expiry year to full format (e.g., "25" -> 2025).
 * 4. If expiry year is less than current year → expired.
 * 5. If expiry year is the same but expiry month is < current month → expired.
 * 6. Otherwise → not expired.
 */
const isDateCurrent = (date) => {
  const today = new Date();

  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  const [expiryMonth, expiryYear] = date.split("/").map(Number);

  const givenYear = 2000 + expiryYear;
  const givenMonth = expiryMonth;

  if (givenYear < todayYear) {
    return isYearExpired;
  }

  if (givenYear === todayYear && givenMonth < todayMonth) return true;
  return false;
 
};

module.exports = isDateCurrent;
