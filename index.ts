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

program
    .action(async () => {
        console.log(process.cwd());

        let messaggio = "";

        await inquirer.prompt(domandeIT)
            .then((rispota) => {
                messaggio = `${rispota.type}:`

            })
        console.log(chalk.green("Commit effettuato"));
        git.commit("header")
        git.commit("body")

    });

program
    .command("init")
    .action(() => {
        console.log("ciao");

    })

program.parse(process.argv);