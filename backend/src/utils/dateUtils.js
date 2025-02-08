import { AddCommand, Command } from "./serverCLI.js";
import { msFromDays, msFromMinutes } from "./timeUtils.js";

/**
 * @param {Date} date
 * @param {number} days
 * @returns {number} timeStap
 */
export function AddDaysToDate(date, days) {
    date.setDate(date.getDate() + days);
    return date.valueOf();
}
/**
 * @param {Date} date
 * @param {number} mins
 * @returns {number} timeStap
 */
export function AddMinsToDate(date, mins) {
    date.setMinutes(date.getMinutes() + mins);
    return date.valueOf();
}

/**
 * @param {number} days
 * @returns {number}
 */
export function DaysFromNow(days) {
    return AddDaysToDate(new Date(), days);
}

let virtualDateEnabled = false;
/** @type {number} */
let dateOffset = msFromDays(1);

/** */
function VirDateNow() {
    return Date.now() + dateOffset;
}

/**
 *
 * @returns {number} Returns the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC).
 */
export function DateNow() {
    return virtualDateEnabled ? VirDateNow() : Date.now();
}

const dateDescription =
    "date <mode> <optional>\n" +
    "\n" +
    "modes:\n" +
    "   addDays - add days to vitual date, requred optional: <number>\n" +
    "   addMins - add minutes to virtual date, requred optional: <number>\n" +
    // "   subDays - subtract days from virtual date, requred optional: <number>\n" +
    // "   subMins - subtract minutes from virtual date, requred optional: <number>\n" +
    "   ven - enable virtual Date\n" +
    "   vdis - dis virtual Date\n" +
    "   v - print virtual date\n" +
    "   rel - print real date\n" +
    "   cur - print current date, can be real or virtual\n" +
    "   sync - synchronize virtual date with real date\n";

/**
 *
 * @param {string[]} args
 */
function HandleDate(args) {
    if (args.length === 0) {
        console.log(
            `datems: ${DateNow()}   date: ${new Date(
                DateNow()
            ).toLocaleString()} `
        );
        console.log('type "help date"');
        return;
    }

    const mode = args[0];

    if (mode === "cur") {
        console.log(
            `datems: ${DateNow()}   date: ${new Date(
                DateNow()
            ).toLocaleString()} `
        );
        return;
    }
    if (mode === "rel") {
        console.log(
            `datems: ${Date.now()}   date: ${new Date(
                Date.now()
            ).toLocaleString()} `
        );
        return;
    }
    if (mode === "v") {
        console.log(
            `datems: ${VirDateNow()}   date: ${new Date(
                VirDateNow()
            ).toLocaleString()} `
        );
        return;
    }

    if (mode === "sync") {
        dateOffset = 0;
        console.log("synchronized!");
        return;
    }

    if (mode === "ven") {
        virtualDateEnabled = true;
        console.log("virtual time is endabled");
        return;
    }
    if (mode === "vdis") {
        virtualDateEnabled = false;
        console.log("virtual time is disabled");
        return;
    }
    if (mode === "addDays") {
        if (args.length < 2) {
            console.log("number of days is required");
            return;
        }
        const days = Number.parseInt(args[1]);
        dateOffset += msFromDays(days);
        console.log(`Added ${days} days`);
        return;
    }

    if (mode === "addMins") {
        if (args.length < 2) {
            console.log("number of mins is required");
            return;
        }
        const mins = Number.parseInt(args[1]);
        dateOffset += msFromMinutes(mins);
        console.log(`Added ${mins} mins`);
        return;
    }

    console.log(`Cant find date with mode <${mode}>`);
    console.log('type "help date"');
}
AddCommand(
    new Command(
        "date",
        HandleDate,
        "provide date maniupulation utilities",
        dateDescription
    )
);
