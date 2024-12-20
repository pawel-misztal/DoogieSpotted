import session, { Store } from "express-session";
import { SessionModel } from "../models/session.model.js";

export default class SequelizeStore extends Store {
    /**
     * 
     * @param {string} sid 
     * @param {(err:any) => void} callback 
     * @returns {void}
     */
    async destroy(sid, callback) {
        try {
            const foundSession = await SessionModel.destroy({
                where: {
                    sid: sid
                }
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
           
            if(!foundSession)
            {
                callback(null, null);
                return;
            }

            /** @type {session.SessionData} */
            const sessionData = JSON.parse(foundSession.dataValues.sessionJSON);
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
        try {
            await SessionModel.create(
                {
                  sid: sid,
                  sessionJSON: JSON.stringify(session)  
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