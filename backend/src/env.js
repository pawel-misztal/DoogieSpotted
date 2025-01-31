import dotenv from "dotenv";

dotenv.config();

export const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

console.log(GEOCODE_API_KEY);
