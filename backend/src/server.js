import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import ip from "ip";
import Path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = Path.dirname(fileURLToPath(import.meta.url));
import dogRaceRouter from "./routes/dogRace.router.js";
import usersRouter from "./routes/user.router.js";
import dogRouter from "./routes/dog.router.js";
import { db } from "./utils/db.js";
import { IsAuth } from "./middlewares/auth.js";
import SequelizeStore from "./utils/sequelizeStore.js";
import { matchesRouter } from "./routes/matches.router.js";
import process from "node:process";
import { dailyMatchesRouter } from "./routes/dailyMatches.router.js";
import {
    populateMockBetter,
    populateMockData,
    populateMockRaces,
} from "./models/mockData/mock.populate.js";
import {
    EnablePeriodicOldDailyMatchDeletion,
    TryFindMatches,
} from "./utils/dailyMatchesEngine.js";
import cors from "cors";
import os from "os";
import fs, { read } from "node:fs";
import http from "http";
import https from "https";
import { AddCommand, AttachCLI, Command } from "./utils/serverCLI.js";
import { msFromMinutes } from "./utils/timeUtils.js";

var privateKey = fs.readFileSync("../backend/ssl/privatekey.key");
var certificate = fs.readFileSync("../backend/ssl/certificate.crt");
var credentials = { key: privateKey, cert: certificate };

const port = 3000;
const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const sequelizeStore = new SequelizeStore(1);

const whitelist = [
    "http://localhost:3001",
    "https://localhost:3001",
    `${ip.address("Wi-Fi")}:3001`,
    `${ip.address()}:3001`,
    "http://192.168.6.175:3001",
    "http://192.168.100.190:3001",
    "http://komputerpawla:3001",

    "https://192.168.6.175:3001",
    "https://192.168.100.190:3001",
    "https://komputerpawla:3001",
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: "secretKey",
        resave: false,
        saveUninitialized: false,
        store: sequelizeStore,
        rolling: true,
        cookie: {
            // sameSite: "lax",
            // httpOnly: true,
            // secure: false,
            maxAge: msFromMinutes(60),
        },
    })
);
app.use(
    cors({
        origin: (org, cb) => {
            // console.log("org:" + org);
            if (!org || whitelist.indexOf(org) !== -1) {
                cb(null, true);
            } else {
                cb(new Error("Not allowed by cors"));
            }
        },
        credentials: true,
    })
);

// app.use('/wykr', (req,res) => {
//     const path =  Path.join(__dirname,'..','public','wykr.png');
//     console.log(path);
//     res.sendFile(path);
// })

// app.use('/generated', (req,res) => {
//     res.sendFile(__dirname + './../public/generated.pdf');
// })

app.use("/api/dogRaces", [IsAuth, dogRaceRouter]);
app.use("/api/dogs", [IsAuth, dogRouter]);
app.use("/api/users", usersRouter);
app.use("/api/matches", [IsAuth, matchesRouter]);
app.use("/api/dailyMatches", [IsAuth, dailyMatchesRouter]);
app.use(express.static(__dirname + "./../public/"));
app.use("/api/testError", async (req, res, next) => {
    next("error Test remove in production");
});
app.use((req, res, next) => {
    console.log(`failed on: ${req.path}`);
    console.log(req.method);
    res.status(404).end();
});
app.use(
    /**
     * @param {unknown} err
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {import('express').NextFunction} next
     */
    (err, req, res, next) => {
        const errorUUID = crypto.randomUUID();
        console.log(`Error UUID: ${errorUUID} error: \n${err}`);
        res.status(500).send(errorUUID);
    }
);

async function startSequence() {
    await db.authenticate();
    await db.sync({
        // force: true,
        alter: { drop: false },
    });

    await populateMockRaces();
    await populateMockBetter();
    // await populateMockData();
    // await TryFindMatches(1, 1);
    // await TryFindMatches(1, 2);

    // app.listen(port, () => {
    //     console.log(`listening on http://localhost:${port}`);
    //     console.log(`listening on http://${ip.address("Wi-Fi")}:${port}`);
    // });
    const serwer = httpsServer.listen(port);
    // serwer.on
}

// console.log(os.networkInterfaces());

function catchUnchachedErrors() {
    process.on("uncaughtException", (error, origin) => {
        console.log(
            "################       uncaughtException       ##############"
        );
        console.log("error: " + error);
        console.log("origin: " + origin);
    });
}

startSequence();
catchUnchachedErrors();

AddCommand(
    new Command(
        "test",
        (args) => {
            console.log("TEST command was fired!");
            for (let i = 0; i < args.length; i++) {
                console.log(`ARG${i}: ${args[i]}`);
            }
        },
        "command to test cli",
        "type this command to get listed args in console"
    )
);
AttachCLI();
EnablePeriodicOldDailyMatchDeletion(1);
