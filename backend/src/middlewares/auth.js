import express from 'express';

/**
 * 
 * @param {express.Request<any, any, any, QueryString.ParsedQs, Record<string, any>>} req 
 * @param {express.Response<any, Record<string, any>, number>} res 
 * @param {function} next 
 */
export function IsAuth(req,res,next)  {
    if(req.session.userId) {
        next();
    } else {
        res.sendStatus(401);
    }
}

/**
 * 
 * @param {express.Request} req 
 * @returns {number} userId
 */
export function TryGetUser(req)
{
    return req.session.userId;
}