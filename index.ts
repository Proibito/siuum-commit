#!/usr/bin/env node

import chalk from "chalk";
import { Command } from 'commander';
import { ResetMode, simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';
import inquirer, { PromptModule, QuestionCollection } from 'inquirer';
import path from 'path';
import { fileURLToPath } from 'url';


const program = new Command();

const options: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(),
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


        /* check the git status */
        await git.status((err, data) => {

            if (err) {
                console.error(chalk.red("Problema con git" + err.message));
                process.exit(-1);
            }


            if (data.staged.length === 0) {
                console.error(chalk.red("Nessun file modificato"));
                process.exit(1);
            }
        });

        await commit();


    });

program
    .command("add")
    .action(async () => {
        await git.status(async (err, data) => {

            if (data.modified.length === 0) {
                console.log(chalk.red("Nessun file modificato"));
                process.exit(1);
            }


            let scelte: { name: string }[] = []
            const daRimuovere = new Set(data.staged)
            let daAggiungere = (data.modified as string[]).filter(x => !daRimuovere.has(x))
            daAggiungere = daAggiungere.concat(data.not_added)

            daAggiungere.forEach(element => {
                scelte.push({ name: element })
            });

            await inquirer.prompt({
                type: 'checkbox',
                name: 'files',
                message: 'Quali files vuoi aggiungere?',
                choices: scelte,
                loop: true,
            }).then(async (risposta) => {
                if (risposta.files.length === 0) {
                    console.log(chalk.red("Nessun file selezionato"));
                    process.exit(1);
                }

                await git.add(risposta.files, (err, data) => {
                    if (err) {
                        console.log(chalk.red(err));
                        process.exit(1);
                    } else if (data) {
                        console.log(data);

                        console.log(chalk.red("Nessun file modificato"));
                    } else {
                        console.log(chalk.cyan("Aggiunti i files staged"));
                    }
                })
            })

            await commit();
        });
    })


async function commit() {

    let type: string = "";
    let soggetto: string = ""
    let body = ""

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
}

program.parse(process.argv);