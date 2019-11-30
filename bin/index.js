#!/usr/bin/env node

const yargs = require("yargs");

const Palette = require('../dist/model/Palette.model').Palette; 
const Image = require('../dist/model/Pl8.model').Image;

const { createBitmapFile } = require('@s-ayers/bitmap');

const options = yargs
    .usage("Usage: -pl8 <pl8> -256 <256>")
    .option("p", { alias: "pl8", describe: "base image file (.pl8)", type: "string", demandOption: true })
    .option("b", { alias: "256", describe: "The palette file", type: "string", demandOption: true })
    .argv;


let bmpFile = options.p.replace(".pl8", ".bmp");

(async () => {

    let pal = await Palette.file(options.b);

    let pp8 =  await Image.file(options.p);
    const tile = pp8.tiles.tiles[0];
    

    const width = pp8.tiles.width;
    const height = pp8.tiles.height*-1;
    const colorTable = pal
      
    
    createBitmapFile({
      filename: bmpFile,
      imageData: pp8.tiles.Orthogonal(),
      width,
      height,
      bitsPerPixel: 8,
      colorTable
    });
    


})()


