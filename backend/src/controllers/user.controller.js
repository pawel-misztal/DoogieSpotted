// eslint-disable-next-line no-unused-vars
import express from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/users.model.js";
import { TryGetUser } from "../middlewares/auth.js";

const SALT_ROUND = 10;

/**
 * @typedef CredentialsBody
 * @type {object}
 * @property {string} email
 * @property {string} password
 */

/**
 *
 * @param {express.Request<any, any, CredentialsBody, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 */
export async function login(req, res, next) {
    try {
        const foundUser = await UserModel.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (!foundUser) {
            res.sendStatus(401);
            return;
        }

        if (
            (await bcrypt.compare(
                req.body.password,
                foundUser.dataValues.passwordHash
            )) === false
        ) {
            res.sendStatus(401);
            return;
        }

        req.session.userId = foundUser.dataValues.id;
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
}

/**
 * @typedef ReqisterRes
 * @type {object}
 * @param {number} id
 */

/**
 * @param {express.Request<any, any, CredentialsBody, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 */
export async function register(req, res, next) {
    try {
        const foundUser = await UserModel.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (foundUser) {
            res.sendStatus(409);
            return;
        }

        await RegisterInternal(req.body.email, req.body.password);

        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
}

/**
 * @typedef ResetPasswordBody
 * @type {object}
 * @property {string} password
 * @property {string} newPassword
 */

/**
 * @param {express.Request<any, any, ResetPasswordBody, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 */
export async function resetPassword(req, res, next) {
    try {
        const userId = TryGetUser(req);
        if (!userId) return;

        if (req.body.newPassword == "") {
            return res.sendStatus(400);
        }

        const foundUser = await UserModel.findOne({
            where: {
                id: userId,
            },
        });

        if (!foundUser) {
            res.sendStatus(400);
            return;
        }

        if (
            (await bcrypt.compare(
                req.body.password,
                foundUser.dataValues.passwordHash
            )) === false
        ) {
            res.sendStatus(400);
            return;
        }

        const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUND);

        await UserModel.update(
            {
                passwordHash: passwordHash,
            },
            {
                where: {
                    id: userId,
                },
            }
        );

        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
}

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns {import("../models/users.model").UserAttr}
 */
export async function RegisterInternal(email, password) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUND);

    const user = await UserModel.create({
        email: email,
        passwordHash: passwordHash,
    });

    return user.dataValues;
}

/**
 *
 * @param {express.Request<any, any, any, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 * @param {()=>void} next
 */
export async function logout(req, res, next) {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        });
    } catch (e) {
        next(e);
    }
}

/**
 * @typedef {object} SessionData
 * @extends express.SessionData
 * @property {number} userId
 */

/**
 *
 * @param {express.Request<any, any, any, QueryString.ParsedQs, Record<string, any>>} req
 * @param {express.Response<any, Record<string, any>, number>} res
 */
export async function getUser(req, res, next) {
    try {
        if (!req.session.userId) {
            res.sendStatus(401);
            return;
        }

        res.json({ userId: req.session.userId });
    } catch (e) {
        next(e);
    }
}
