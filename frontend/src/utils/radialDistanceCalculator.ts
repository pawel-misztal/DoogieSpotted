import { LonLat } from "../models/types";
import { Vector3 } from "./vector3";

export const EARTH_RADIUS_KM = 6_378;

export function GetDistanceBetweenTwoPlaces(a: Vector3, b: Vector3): number {
    return Vector3.SphereDistance(a, b, EARTH_RADIUS_KM);
}
