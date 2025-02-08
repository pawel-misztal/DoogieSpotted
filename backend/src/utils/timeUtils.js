/**
 * @param {number} minutes
 * @returns {number}
 */
export function msFromDays(minutes) {
    return msFromHours(24 * minutes);
}

/**
 * @param {number} minutes
 * @returns {number}
 */
export function msFromHours(minutes) {
    return msFromMinutes(60 * minutes);
}

/**
 * @param {number} minutes
 * @returns {number}
 */
export function msFromMinutes(minutes) {
    return msFromSeconds(60 * minutes);
}

/**
 * @param {number} minutes
 * @returns {number}
 */
export function msFromSeconds(seconds) {
    return 1000 * seconds;
}
