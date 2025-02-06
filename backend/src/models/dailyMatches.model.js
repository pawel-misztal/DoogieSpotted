import { db } from "../utils/db.js";
// eslint-disable-next-line no-unused-vars
import sequelize, { DataTypes } from "sequelize";
import { DogModel } from "./dog.model.js";

/**
 * @typedef DailyMatchesAttr
 * @type {object}
 * @property {number} id
 * @property {number} lowerDogId
 * @property {number} higherDogId
 * @property {number} lowerDogLiked
 * @property {number} higherDogLiked
 * @property {number} expirationDate //time since 1970 as number
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @type {sequelize.ModelStatic<sequelize.Model<DailyMatchesAttr,DailyMatchesAttr>>}
 */
export const DailyMatchesModel = db.define(
    "daily_matches",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        lowerDogId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: DogModel,
                key: "id",
            },
        },
        higherDogId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: DogModel,
                key: "id",
            },
        },
        lowerDogLiked: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        higherDogLiked: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        expirationDate: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
    },
    {
        createdAt: true,
        updatedAt: false,
    }
);
