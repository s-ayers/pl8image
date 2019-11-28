#!/usr/bin/env node

const yargs = require("yargs");

const options = yargs
    .usage("Usage: -pl8 <pl8> -256 <256>")
    .option("p", { alias: "pl8", describe: "base image file (.pl8)", type: "string", demandOption: true })
    .option("2", { alias: "256", describe: "The palette file", type: "string", demandOption: true })
    .argv;

const greeting = `Hello, ${options.name}!`;

console.log(greeting);