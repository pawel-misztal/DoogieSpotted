import express, { Router } from "express";
import { dogRaceById, dogRaces } from "../controllers/dogRace.controller.js";
import Path from 'node:path';


const router = Router();


router.get('/', dogRaces);

router.get('/id/:id', dogRaceById);

// console.log(import.meta.dirname + '.\\..\\..\\protected\\dogRaces\\images\\');
// console.log(Path.join(import.meta.dirname,'..','..','protected','dogRaces','images'));

//hacky workaround, for some reason if I use '/images' as a path, then this endpoint will not be recognized :(
router.get(/images/ ,[(req,res,next) => {
    /**
     * @type {String} 
     */
    const url = req.url;
    req.url = url.replace('/images','');
    next();
}, express.static(Path.join(import.meta.dirname,'..','..','protected','dogRaces','images'))]);

// router.get('/images/:path' ,[(req,res,next) => {
//     console.log(req.params.path);
//     console.log(req.url);
//     req.url = req.path;
//     console.log(req.path);
//     console.log(req.url);
//     next();
// }, express.static(Path.join(import.meta.dirname,'..','..','protected','dogRaces','images'))]);


export default router;