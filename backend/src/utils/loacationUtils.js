//
export const EARTH_RADIUS_KM = 6_378;
export const EARTH_RADIUS_M = EARTH_RADIUS_KM * 1000;

/**
 * @typedef {object} Vector3
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * this function assume that longitude and lattitude is valid
 *
 * - Z is pointing to north pole
 * - X is pointing to 0 longitude
 * - Y direction is calculated from vector multiplication cross(X,Z) so it will point into East side of the globe longitude -> 90
 *
 * @param {number} longitude
 * @param {number} latitude
 * @returns {Vector3}
 */
export function LonLatToPos(longitude, latitude) {
    const degToRad = Math.PI / 180;
    const x = Math.sin(longitude * degToRad) * EARTH_RADIUS_KM;
    const y = Math.cos(longitude * degToRad) * EARTH_RADIUS_KM;
    const z = Math.sin(latitude * degToRad) * EARTH_RADIUS_KM;

    /** @type {Vector3} */
    return {
        x: x,
        y: y,
        z: z,
    };
}

/**
 * this function returns true if both longitude and latitude are valid
 * @param {number} longitude
 * @param {number} latitude
 * @returns {boolean}
 */
export function IsLonLatValid(longitude, latitude) {
    return (
        longitude <= 180 &&
        longitude >= -180 &&
        latitude <= 90 &&
        latitude <= -90
    );
}
