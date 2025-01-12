
/**
 * 
 * @param {number} timeMs 
 */
export async function WaitMs(timeMs) {
    await new Promise((resolve) => setTimeout(resolve,timeMs));
}

/**
 * 
 * @param {number} timeMs 
 */
export async function WaitSeconds(timeSec) {
    await WaitMs(timeSec * 1000);
}

/**
 * 
 * @param {number} timeMs 
 */
export async function WaitMinutes(timeMin) {
    await WaitSeconds(timeMin * 60)
}
