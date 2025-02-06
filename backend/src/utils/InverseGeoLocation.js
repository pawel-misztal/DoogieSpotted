import axios from "axios";
import { GEOCODE_API_KEY } from "../env.js";

/**
 * @typedef Address
 * @type {object}
 * @property {string} city
 *
 *
 * @typedef ReverseGeoRes
 * @type {object}
 * @property {Address} address
 */

/**
 *
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<string>}
 */
export async function GetCityFromLatLon(lat, lon) {
    console.log("lon: " + lon + " lat: " + lat);
    if (lat === "" || lon === "") return "";

    lat = Number.parseFloat(lat);
    lon = Number.parseFloat(lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) return "";

    if (lon > 180 || lon < -180 || lat > 90 || lat < -90) return "";

    try {
        /** @type {import('axios').AxiosResponse<ReverseGeoRes, any>}*/
        const res = await axios.get(
            `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=${GEOCODE_API_KEY}`
        );
        if (!res.data) return "";

        // console.log(res.data);
        const city = res.data.address.city;
        if (!city) return "";
        return city;
    } catch (e) {
        console.log("reverse geo error");
        console.log(e);
        return "";
    }
}
