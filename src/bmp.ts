
import {Palette} from './model/Palette.model'; 
import { Image } from './model/Pl8.model';
import fs from 'fs';

const { padImageData, createBitmapFile, readBitmapFile } = require('@s-ayers/bitmap');




(async () => {
    const bitmapFile = await readBitmapFile("data/out.bmp");

    console.log(bitmapFile);

    let pal = await Palette.buffer('./data/BASE01.256');

    console.log(pal);
    let pp8 =  await Image.file('./data/VILLAGE.PL8');
    const tile = pp8.tiles.tiles[0];
    
    console.log(tile);

    const width = tile.width;
    const height = tile.height*-1;
    const colorTable = pal
      
    const imageData = padImageData({
      unpaddedImageData:tile.raw,
      width,
      height
    });
    
    let bob = await createBitmapFile({
      filename: "data/out.bmp",
      imageData,
      width,
      height,
      bitsPerPixel: 8,
      colorTable
    });
    


})()

