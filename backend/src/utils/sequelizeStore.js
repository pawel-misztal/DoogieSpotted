// eslint-disable-next-line no-unused-vars
import session, { Store } from "express-session";
import { SessionModel } from "../models/session.model.js";
import { WaitMinutes } from "./promiseUtils.js";
import { Op } from "sequelize";
import { DateNow } from "./dateUtils.js";

export default class SequelizeStore extends Store {
    /**
     *
     * @param {number} cleanTimeIntervalMinutes
     */
    constructor(cleanTimeIntervalMinutes) {
        super();

        if (cleanTimeIntervalMinutes) {
            this.cleanOldSessions(cleanTimeIntervalMinutes);
        }
    }

    /**
     * @param {number} cleanTimeIntervalMinutes
     */
    async cleanOldSessions(cleanTimeIntervalMinutes) {
        await WaitMinutes(cleanTimeIntervalMinutes);

        console.log("Performing occasional session store clean up");
        try {
            const destroyedOldSessionsCount = await SessionModel.destroy({
                where: {
                    expires: { [Op.lt]: DateNow() },
                },
            });
            console.log(
                `Destroyed old cookies count: ${destroyedOldSessionsCount}`
            );
        } catch (e) {
            console.log(e);
        }

        this.cleanOldSessions(cleanTimeIntervalMinutes);
    }

    /**
     *
     * @param {string} sid
     * @param {(err:any) => void} callback
     * @returns {void}
     */
    async destroy(sid, callback) {
        try {
            await SessionModel.destroy({
                where: {
                    sid: sid,
                },
            });
            callback();
        } catch (error) {
            console.log(error);
            callback(error);
        }
    }

    /**
     *
     * @param {string} sid
     * @param {(err: any, session?: session.SessionData | null) => void} callback
     * @returns {void}
     */
    async get(sid, callback) {
        try {
            const foundSession = await SessionModel.findByPk(sid);

            // console.log(`Store get ${sid}`);

            if (!foundSession) {
                callback(null, null);
                return;
            }

            if (
                foundSession.dataValues.expires !== 0 &&
                DateNow() > foundSession.dataValues.expires
            ) {
                await SessionModel.destroy({
                    where: {
                        sid: sid,
                    },
                });
                callback(null, null);
                return;
            }

            /** @type {session.SessionData} */
            const sessionData = JSON.parse(foundSession.dataValues.sessionJSON);
            // console.log(sessionData);
            callback(null, sessionData);
        } catch (error) {
            console.log(error);
            callback(error);
        }
    }

    /**
     *
     * @param {string} sid
     * @param {session.SessionData} session
     * @param {((err?: any) => void)?} callback
     * @returns {void}
     */
    async set(sid, session, callback) {
        const expiresTimestamp = new Date(session.cookie.expires).valueOf();
        try {
            await SessionModel.create({
                sid: sid,
                sessionJSON: JSON.stringify(session),
                expires: expiresTimestamp,
            });

            callback();
        } catch (error) {
            console.log(error);
            callback(error);
        }
    }
    // abstract get(sid: string, callback: (err: any, session?: SessionData | null) => void): void;

    // destroy(sid, callback?: (err?: any) => void): void;
}
