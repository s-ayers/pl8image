#!/usr/bin/env node

import { program } from "commander";
import clear from "clear";
import { exit } from "process";
import { GraphicFactory } from "./graphic-factory";
import path from "path";
import { Pl8 } from "./parsers/pl8";
import { SpriteSheet } from "./model/spritesheet";
import { Palette } from "./model/palette";

const fs = require("fs");

// clear();

program
  .version("0.0.1")
  .description("An example CLI for ordering pizza's")
  .option("-2, --256 <palette>", "Add palette file")
  .option("-m, --many", "Add the specified type of cheese [marble]")
  .option("-p, --pl8 <image>", "Add pl8 file(s)")
  .option("-o, --output <dir/file>", "Output file/directory")
  .option("-s, --single", "You do not want any cheese")
  .option("-i, --isometric", "Force isometric conversion")
  .parse(process.argv);

const options = program.opts();
console.log(options);

if (options.single && options.many) {
  console.error("--single and --many are mutually exclusive");
  exit(400);
}

const cwd = process.cwd();

const palettePath = path.join(cwd, options["256"]);
if (!fs.existsSync(palettePath)) {
  console.error(`Palette file "${palettePath}" does not exist.`);
  exit(400);
}

const pl8Path = path.join(cwd, options.pl8);
if (!fs.existsSync(pl8Path)) {
  console.error(`Pl8 file "${pl8Path}" does not exist.`);
  exit(400);
}

const paletteBuf = fs.readFileSync(palettePath);
const palette = Palette(paletteBuf);
const pl8Buf = fs.readFileSync(pl8Path);

const pl8 = Pl8.parse(pl8Buf);
// console.log(pl8);
let override = null;
if (options.isometric) {
    override = 2;
}
const sheet = new SpriteSheet(pl8, override);
const sprites = [];

sheet.Sprites.forEach((sprite) => {
//   console.log(sprite);
  sprites.push(sprite.toPng(palette));
});

sprites.forEach((data, index) => {
//   const i = util.format('%03d', index);
const i = index.toString().padStart(3, '0');
  fs.writeFileSync(`data/out/road-${i}.png`, data);
});
