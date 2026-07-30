#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

const Palette = require("../dist/model/Palette.model").Palette;
const Image = require("../dist/model/Pl8.model").Image;
const { GraphicFactory } = require("../dist/graphic-factory");

const options = yargs
  .usage("Usage: pl8image -p <pl8> -b <256> [-o <out>] [--format png|bmp]")
  .option("p", {
    alias: "pl8",
    describe: "base image file (.pl8)",
    type: "string",
    demandOption: true,
  })
  .option("b", {
    alias: "256",
    describe: "The palette file (.256)",
    type: "string",
    demandOption: true,
  })
  .option("o", {
    alias: "output",
    describe: "Output file path",
    type: "string",
  })
  .option("format", {
    alias: "f",
    describe: "Output format",
    choices: ["png", "bmp"],
    default: "bmp",
  })
  .argv;

const format = options.format;
const defaultOut = options.p.replace(/\.pl8$/i, `.${format}`);
const outFile = options.o || defaultOut;

(async () => {
  const pal = await Palette.file(options.b);
  const raw = fs.readFileSync(options.p);
  const pp8 = Image.buffer(raw);

  const graphic = GraphicFactory.Pl8(pp8, pal, raw);
  if (!graphic) {
    console.error(`Unsupported .pl8 type: ${pp8.type}`);
    process.exit(1);
  }

  const outDir = path.dirname(outFile);
  if (outDir && outDir !== "." && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const data =
    format === "png" ? await graphic.toPNG() : await graphic.toBMP();
  fs.writeFileSync(outFile, data);
  console.log(`Wrote ${outFile}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
