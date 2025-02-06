/**
 * @param {Date} date
 * @param {number} days
 * @returns {number} timeStap
 */
export function AddDaysToDate(date, days) {
    date.setDate(date.getDate() + days);
    return date.valueOf();
}

/**
 * @param {number} days
 * @returns {number}
 */
export function DaysFromNow(days) {
    return AddDaysToDate(new Date(), days);
}
