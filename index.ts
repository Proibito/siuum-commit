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

const tipoCustomIT = [
    {
        type: "input",
        name: "soggetto",
        message: "Inserisci il tipo custom del commit"
    }
]

const bodyIt = [
    {
        type: "input",
        name: "soggetto",
        message: "Inserisci il corpo del commit",
        validate(input: string) {
            return validateNonEmpty(input);
        }
    }
]

function validateNonEmpty(value: string) {
    if (value.length === 0) {
        throw Error("Non puoi lasciare vuoto questo campo");
    } else if (value.length < 10) {
        throw Error("Il soggetto deve essere lungo almeno 10 caratteri");
    }
    return true;
}


program
    .action(async () => {
        let type: string = "";
        let soggetto: string = ""
        let body = ""

        /* check the git status */
        await git.status((err, data) => {
            if (data.staged.length === 0) {
                console.log(chalk.red("Nessun file modificato"));
                process.exit(1);
            }
        });


        await inquirer.prompt(domandeIT)
            .then(async (rispota) => {
                if (rispota.type === "custom") {
                    await inquirer.prompt(tipoCustomIT).then((risposta) => {
                        type = risposta.soggetto
                    })
                    return
                }
                type = rispota.type
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

        await git.commit(messaggio, (err, data) => {
            if (err) {
                console.log(chalk.red(err));
            } else if (data.summary.changes === 0) {
                console.log(chalk.red("Nessun file modificato"));
            } else {
                console.log(chalk.cyan("Fatto il commit 🌈"));
            }
        })

    });

program
    .command("init")
    .action(() => {
        console.log("ciao");
    })

program.parse(process.argv);