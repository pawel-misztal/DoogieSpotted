import { db } from "../utils/db.js";
// eslint-disable-next-line no-unused-vars
import sequelize, { DataTypes } from 'sequelize';

/**
 * @typedef UserAttr
 * @type {object}
 * @property {number} id
 * @property {string} email
 * @property {string} googleId
 * @property {string} passwordHash
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef UserCreateAttr
 * @type {object}
 * @property {string} email
 * @property {string} googleId
 * @property {string} passwordHash
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @type {sequelize.ModelStatic<sequelize.Model<UserAttr,UserCreateAttr>}
 */
export const UserModel = db.define(
    'users',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: { 
            type: DataTypes.STRING(256),
            allowNull: false,
            defaultValue: '',
            unique: true,
        },
        googleId: {
            type: DataTypes.STRING(512),
            allowNull: true,
            unique: true
        },
        passwordHash: { 
            type: DataTypes.STRING(1024),
        }
    },
    {
        createdAt: true,
        updatedAt: true
    }
);