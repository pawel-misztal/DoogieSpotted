import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import ip from 'ip';
import Path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = Path.dirname(fileURLToPath(import.meta.url));
import dogRaceRouter from './routes/dogRace.router.js';
import usersRouter from './routes/user.router.js';
import dogRouter from './routes/dog.router.js';
import { db } from './utils/db.js';
import { IsAuth } from './middlewares/auth.js';
import SequelizeStore from './utils/SequelizeStore.js';
import { matchesRouter } from './routes/matches.router.js';
import process from 'node:process';
import { dailyMatchesRouter } from './routes/dailyMatches.router.js';
import { populateMockData } from './models/mockData/mock.populate.js';
import { TryFindMatches } from './utils/dailyMatchesEngine.js';

const port = 3000;
const app = express();

const sequelizeStore = new SequelizeStore();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    store: sequelizeStore
}))


// app.use('/wykr', (req,res) => {
//     const path =  Path.join(__dirname,'..','public','wykr.png');
//     console.log(path);
//     res.sendFile(path);
// })

// app.use('/generated', (req,res) => {
//     res.sendFile(__dirname + './../public/generated.pdf');
// })

app.use('/dogRaces',[IsAuth, dogRaceRouter]);
app.use('/dogs',[IsAuth, dogRouter]);
app.use('/users', usersRouter);
app.use('/matches', [IsAuth, matchesRouter]);
app.use('/dailyMatches', [IsAuth, dailyMatchesRouter]);
app.use(express.static(__dirname + './../public/'));
app.use('/testError', async (req,res, next) =>{
    next('error Test remove in production');
})
app.use((req,res,next)=>{
    console.log(`failed on: ${req.path}`);
    console.log(req.method);
    res.status(404).end();
})
app.use(
    /**
     * @param {unknown} err 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {import('express').NextFunction} next
     */
    (err,req,res,next) => {
        const errorUUID = crypto.randomUUID();
        console.log(`Error UUID: ${errorUUID} error: \n${err}`);
        res.status(500).send(errorUUID);
    }
)

async function startSequence() {
    await db.authenticate();
    await db.sync({
        force: true,
        alter: false
    });
    
    await populateMockData();
    await TryFindMatches(1,1);
    await TryFindMatches(1,2);


    app.listen(port,() => {
        console.log(`listening on http://localhost:${port}`);
        console.log(`listening on http://${ip.address()}:${port}`);
    });
}

function catchUnchachedErrors() {
    process.on('uncaughtException', (error, origin) => {
        console.log('################       uncaughtException       ##############');
        console.log('error: ' + error);
        console.log('origin: ' + origin);
    })
}

startSequence();
catchUnchachedErrors();