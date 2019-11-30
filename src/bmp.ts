
import {Palette} from './model/Palette.model'; 
import { Image } from './model/Pl8.model';
import * as fs from "fs";

const {  createBitmapFile } = require('@s-ayers/bitmap');




(async () => {

    let pal = await Palette.file('./data/BASE01.256');

    let pp8 =  await Image.file('./data/Village.pl8');

    fs.writeFile("data/out.bmp", pp8.Orthogonal(pal), err => {
      if (err) throw err;
    });

    


})()

