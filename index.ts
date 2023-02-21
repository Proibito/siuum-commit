import { sleep } from "bun";
import chalk from "chalk";
import { Command } from 'commander';
import { ResetMode, simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';

const program = new Command();

const options: Partial<SimpleGitOptions> = {
    baseDir: "C:\\Users\\Utente\\CLI-github",
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
};

const git: SimpleGit = simpleGit(options);

program
    .command("commit")
    .action(async () => {
        git.commit("sium")

    });


program.parse(process.argv);