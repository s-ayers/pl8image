
import {Palette} from './model/Palette.model'; 
import { Image } from './model/Pl8.model';
import * as fs from 'fs';

const { padImageData, createBitmapFile } = require('@s-ayers/bitmap');




(async () => {

    let pal = await Palette.file('./data/BASE01.256');

    let pp8 =  await Image.file('./data/VILLAGE.PL8');
    const tile = pp8.tiles.tiles[0];
    

    const width = pp8.tiles.width;
    const height = pp8.tiles.height*-1;
    const colorTable = pal
      
    const imageData = padImageData({
      unpaddedImageData: pp8.tiles.Orthogonal(),
      width,
      height
    });
    
    createBitmapFile({
      filename: "data/out.bmp",
      imageData: pp8.tiles.Orthogonal(),
      width,
      height,
      bitsPerPixel: 8,
      colorTable
    });
    


})()

