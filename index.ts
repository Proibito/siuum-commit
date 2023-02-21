#!/usr/bin/env node

import { sleep } from "bun";
import chalk from "chalk";
import { Command } from 'commander';
import { ResetMode, simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';
import inquirer, { PromptModule, QuestionCollection } from 'inquirer';
import path from 'path';
import { fileURLToPath } from 'url';



const program = new Command();

const options: Partial<SimpleGitOptions> = {
    baseDir: "C:\\Users\\Utente\\CLI-github",
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
};

const git: SimpleGit = simpleGit(options);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const domandeIT: QuestionCollection = [
    {
        type: 'list',
        name: 'type',
        message: 'Che cosa vuoi fare?',
        choices: ['docs', 'feat', 'fix', 'pref', 'refactor', 'test', 'custom'],
        loop: true,

        // filter(val) {
        //     return val.toLowerCase();
        // },
    }
]

const soggettoIt = [
    {
        type: "input",
        name: "soggetto",
        message: "Inserisci il soggetto del commit",
        validate(input: string) {
            return validateNonEmpty(input);
        }
    }
]

const bodyIt = [
    {
        type: "input",
        name: "soggetto",
        message: "Inserisci il soggetto del commit",
        validate(input: string) {
            return validateNonEmpty(input);
        }
    }
]

function validateNonEmpty(value: string) {
    if (value.length === 0) {
        throw Error("Non puoi lasciare vuoto questo campo");
    } else if (value)
        return true;
}


program
    .action(async () => {
        console.log(process.cwd());

        let type: string = "";
        let soggetto: string = ""
        let body = ""
        await inquirer.prompt(domandeIT)
            .then((rispota) => {
                type = `${rispota.type}`
            })

        console.log(chalk.green(`type scelto: ${type}`));

        await inquirer.prompt(soggettoIt).then((risposta) => {
            soggetto = risposta.soggetto
        })
        console.log(chalk.green(`soggetto: ${soggetto}`));

        await inquirer.prompt(bodyIt).then((risposta) => {
            body = risposta.soggetto
        })

        let messaggio = `${type}: ${soggetto}

${body}
        
        
`

        console.log(messaggio);

        // git.commit(messaggio, (err, data) => {
        //     if (err) {
        //         console.log(chalk.red(err));
        //     } else {
        //         console.log(chalk.green(data));
        //     }
        // })


    });

program
    .command("init")
    .action(() => {
        console.log("ciao");

    })

program.parse(process.argv);