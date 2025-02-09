import https from "https";
import { WebSocket, WebSocketServer } from "ws";
import express from "express";

let wss;

/** @type {Map<string,WebSocket>} */
let connectedUsers = new Map();

/**
 *
 * @param {https.Server<typeof http.IncomingMessage, typeof http.ServerResponse>} serwer
 * @param {express.RequestHandler<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>} sessionMiddleware
 */
export function AttachWebSocketSerwer(serwer, sessionMiddleware) {
    wss = new WebSocketServer({ noServer: true, path: "/websocket" });

    serwer.on("upgrade", (req, socket, head) => {
        console.log("upgrade");
        sessionMiddleware(req, {}, () => {
            // console.log(req);
            if (!req.session.userId) {
                console.log("no user id -> closing");
                socket.emit("close");
                socket.destroy();
                return;
            }

            wss.handleUpgrade(req, socket, head, (s, r) => {
                wss.emit("connection", s, r);
            });
        });
    });

    wss.on("connection", (socket, req) => {
        // console.log(req);
        // socket.send("Hello " + req.session.userId);
        const userId = req.session.userId;
        connectedUsers.set(userId, socket);

        socket.on("message", (data) => {
            console.log(data);
            socket.send("Recieved: " + data);
            socket.emit("Recieved", data);
        });

        socket.on("close", () => {
            console.log("user closed " + req.session.userId);
            connectedUsers.delete(userId);
        });
    });
}

/**
 *
 * @param {string} userId
 * @param {any} data
 */
export function SendToUser(userId, data) {
    const ws = connectedUsers.get(userId);
    console.log(userId + " " + (ws !== undefined));
    if (!ws) return;

    ws.send(data);
}

/**
 *
 * @param {any} data
 */
export function SendToAllUsers(data) {
    console.log("send to all");
    // console.log(connectedUsers.values());
    connectedUsers.forEach((ws, key) => {
        ws.send(data);
    });
}

export const STATUS_NEW_MATCH = 1;

export class Msg {
    /**
     * @param {number} status
     */
    constructor(status) {
        this.status = status;
    }
}
