import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import { compareSync } from "bcrypt";

// command structure
// COMMAND_NAME ARG1 ARG2 ...

export class Command {
    /**
     *
     * @param {string} commandName
     * @param {(args:string[]) => void} func
     * @param {string} helpMsg
     * @param {string} description
     */
    constructor(commandName, func, helpMsg, description) {
        this.commandName = commandName;
        this.func = func;
        this.helpMsg = helpMsg;
        this.description = description;
    }

    /**
     *
     * @param {string[] | undefined} args
     */
    Exec(args) {
        // console.log(args);
        this.func(args);
    }

    PrintDescription() {
        console.log(this.description);
    }
}

/** @type {Command[]} */
let commands = [];

/**
 * thorw error if there is command with that name
 * @param {Command} command
 */
export function AddCommand(command) {
    if (commands.findIndex((c) => c.commandName == command.commandName) !== -1)
        throw Error(
            "Adding second function with that name: " + command.commandName
        );

    commands.push(command);
}

/**
 * @param {string} commandName
 */
export function RemoveCommand(commandName) {
    const index = commands.findIndex((c) => (c.commandName = commandName));

    if (index === -1) return;
    commands.splice(index, 1);
}

/**
 *
 * @param {string} line
 */
function ExecCommand(line) {
    line = line.replace(/\s+/g, " ");
    const words = line.split(" ");
    if (words.length === 0) return;
    const commandName = words[0];
    const args = words.splice(1);

    for (let i = 0; i < commands.length; i++) {
        const c = commands[i];
        if (c.commandName === commandName) {
            c.Exec(args);
            return;
        }
    }

    console.log(`Not found command with name <${commandName}>`);
    console.log('   type "help <commandName>" to get help on command');
    console.log('   type "list" to get command list');
}

let cli = createInterface({
    input: stdin,
    output: stdout,
});

AddCommand(
    new Command(
        "list",
        () => {
            console.log("Printing all Commands");
            br();
            commands.forEach((c) => {
                console.log(`   ${c.commandName} - ${c.helpMsg}`);
            });
        },
        "list all awailable commands in console"
    )
);

AddCommand(
    new Command("help", (args) => {
        if (!args || args.length === 0) {
            console.log("You need to provide command name");
            return;
        }
        for (let i = 0; i < commands.length; i++) {
            const c = commands[i];
            if (c.commandName == args[0]) {
                console.log(`Description for <${c.commandName}> command`);
                br();
                console.log(c.description);
                return;
            }
        }

        console.log(`Not found command with name <${args[0]}>`);
        console.log('   type "list" to get command list');
    })
);

AddCommand(
    new Command(
        "clear",
        () => {
            console.clear();
        },
        "clear console"
    )
);

export const br = () => console.log("-------------------------");
export const empty = () => console.log("");
/**
 *
 */
export function AttachCLI() {
    cli.on("line", (line) => {
        // console.log(`Received: ${line}`);
        br();
        ExecCommand(line);
        br();
        empty();
    });
}
