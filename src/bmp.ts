
import {Palette} from './model/Palette.model'; 
import { Image } from './model/Pl8.model';
import fs from 'fs';

const { padImageData, createBitmapFile } = require('@s-ayers/bitmap');




(async () => {

    let pal = await Palette.file('./data/BASE01.256');

    let pp8 =  await Image.file('./data/VILLAGE.PL8');
    const tile = pp8.tiles.tiles[0];
    

    const width = tile.width;
    const height = tile.height*-1;
    const colorTable = pal
      
    const imageData = padImageData({
      unpaddedImageData:tile.Orthogonal(),
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

