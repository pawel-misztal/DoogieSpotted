// eslint-disable-next-line no-unused-vars
import express from 'express'
import bcrypt from 'bcrypt';
import { UserModel } from '../models/users.model.js';

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
export async function login(req,res) {
    console.log(`login ${req.body.email} ${req.body.password}`);

    const foundUser = await UserModel.findOne({
        where: {
            email: req.body.email
        }
    });

    if(!foundUser)
    {
        res.sendStatus(401);
        return;
    }

    if(await bcrypt.compare(req.body.password, foundUser.dataValues.passwordHash) === false)
    {
        res.sendStatus(401);
        return;
    }

    req.session.userId = foundUser.dataValues.id;
    res.sendStatus(200);
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
export async function register(req,res) {
    const foundUser = await UserModel.findOne({
        where: {
            email:req.body.email
        }
    });

    if(foundUser)
    {
        res.sendStatus(409);
        return;
    }

    const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUND);

    await UserModel.create({
        email: req.body.email,
        passwordHash: passwordHash
    });

    res.sendStatus(200);
}

/**
 * 
 * @param {express.Request<any, any, any, QueryString.ParsedQs, Record<string, any>>} req 
 * @param {express.Response<any, Record<string, any>, number>} res 
 */
export async function logout(req,res) {
    req.session.destroy((err) => {
        if(err){
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
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
export async function getUser(req,res) {
    if(!req.session.userId)
    {
        res.sendStatus(401);
        return;
    }

    res.json({userId:req.session.userId});
}