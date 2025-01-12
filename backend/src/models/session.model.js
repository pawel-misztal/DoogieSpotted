// eslint-disable-next-line no-unused-vars
import sequelize, { DataTypes } from "sequelize";
import { db } from "../utils/db.js";

/**
 * @typedef SessionAttr
 * @type {object}
 * @property {string} sid
 * @property {string} sessionJSON
 * @property {number} expires
 */

/**
 * @type {sequelize.ModelStatic<sequelize.Model<SessionAttr,SessionAttr>>}
 */
export const SessionModel = db.define(
    'session',
    {
        sid: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.STRING
        },
        sessionJSON: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        expires: {
            type: DataTypes.INTEGER
        }
    },
    {
        createdAt: false,
        updatedAt: false
    }
)