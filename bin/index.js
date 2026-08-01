#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

const Palette = require("../dist/model/Palette.model").Palette;
const Image = require("../dist/model/Pl8.model").Image;
const { GraphicFactory } = require("../dist/graphic-factory");

const options = yargs
  .usage(
    "Usage: pl8image -p <pl8> -b <256> [-o <out>] [--format png|bmp] [--width N] [--height N] [--sprites]",
  )
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
    describe: "Output file path (or stem when --sprites)",
    type: "string",
  })
  .option("format", {
    alias: "f",
    describe: "Output format",
    choices: ["png", "bmp"],
    default: "png",
  })
  .option("width", {
    describe: "Composition canvas width",
    type: "number",
    default: 640,
  })
  .option("height", {
    describe: "Composition canvas height",
    type: "number",
    default: 480,
  })
  .option("sprites", {
    describe: "Export each sprite as a separate image",
    type: "boolean",
    default: false,
  }).argv;

const format = options.format;
const defaultOut = options.p.replace(/\.pl8$/i, `.${format}`);
const outFile = options.o || defaultOut;

function ensureDir(filePath) {
  const outDir = path.dirname(filePath);
  if (outDir && outDir !== "." && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
}

function stemFromOutput(filePath) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  return path.join(dir, base);
}

async function encodeGraphic(graphic) {
  return format === "png" ? graphic.toPNG() : graphic.toBMP();
}

function tileGraphic(tile, fileType, palette) {
  if (fileType === Image.TYPE.ORTHOGONAL) {
    return tile.Orthogonal(palette);
  }
  if (fileType === Image.TYPE.RLE_ENCODED) {
    return tile.Rle(palette);
  }
  return tile.Isometric(palette);
}

function ensureTileRaw(tile, tiles, index, fileType, buf) {
  if (typeof tile.raw !== "undefined" && tile.raw.length > 0) {
    return;
  }
  if (fileType === Image.TYPE.RLE_ENCODED) {
    const end = GraphicFactory.rlePayloadEnd(tiles, index, buf.length);
    tile.raw = buf.slice(tile.offset, end);
    return;
  }
  const size = GraphicFactory.tileSize(
    tile.extraType,
    tile.width,
    tile.height,
    tile.extraRows,
  );
  tile.raw = buf.slice(tile.offset, tile.offset + size);
}

(async () => {
  const pal = await Palette.file(options.b);
  const raw = fs.readFileSync(options.p);
  const pp8 = Image.buffer(raw);
  pp8.width = options.width;
  pp8.height = options.height;

  if (options.sprites) {
    const stem = stemFromOutput(outFile);
    ensureDir(`${stem}-000.${format}`);
    for (let i = 0; i < pp8.tiles.length; i++) {
      const tile = pp8.tiles[i];
      ensureTileRaw(tile, pp8.tiles, i, pp8.type, raw);
      const graphic = tileGraphic(tile, pp8.type, pal);
      const spritePath = `${stem}-${String(i).padStart(3, "0")}.${format}`;
      const data = await encodeGraphic(graphic);
      fs.writeFileSync(spritePath, data);
      console.log(`Wrote ${spritePath}`);
    }
    return;
  }

  const graphic = GraphicFactory.Pl8(pp8, pal, raw);
  ensureDir(outFile);
  const data = await encodeGraphic(graphic);
  fs.writeFileSync(outFile, data);
  console.log(`Wrote ${outFile}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
