
import {Palette} from "./model/Palette.model";
import { Image } from "./model/Pl8.model";

import * as fs from "fs";

const { padImageData, createBitmapFile } = require("bitmap-js");

(async () => {
const colorTable = fs.readFileSync("./data/BASE01.256");
const pp8 =  await Image.file("./data/VILLAGE.PL8");
const tile = pp8.tiles[0];

// console.log(tile);

// const imageData = padImageData({
//     unpaddedImageData: Buffer.from([
//       0b00000000,
//       0b00111100,
//       0b01000010,
//       0b00000000,
//       0b00100100,
//       0b00000000
//     ]),
//     width,
//     height
//   });

//   await createBitmapFile({
//     filename: "smiley.bmp",
//     imageData,
//     width,
//     height,
//     bitsPerPixel: 1,
//     colorTable
//   });

// console.log(myPal);

})();

// (async () => {
//     let myPal = await Palette.file('./data/BASE01.256'),
//         myImage = await Image.file('./data/VILLAGE.PL8');

//         console.log(myImage);

// })()

// Palette.file('./data/BASE01.256').then( pal => {

//     Image.file('./data/VILLAGE.PL8').then(value => {
//         // console.log(value.tiles.tiles[0].Orthogonal(pal));

// const myTile = value.tiles.tiles[0];
//         const myImage = new PNG({
//             height: myTile.height,
//             width: myTile.width,
//             inputHasAlpha: true,
//             bitDepth: 8
//         });
//         myImage.data = myTile.Orthogonal(pal);
//  console.log(myImage.data);

// // console.log(myTile.Orthogonal(pal).length);

//  var buffer = PNG.sync.write(myImage);
// //  console.log(buffer);
// fs.writeFileSync('./data/out.png', buffer);

//         // .parse(myTile.Orthogonal(pal), (error, data) => {

//         //     console.log(error);
//         //     console.log(data);
//         //     fs.writeFile('./data/out.png', data, () => {
//         //         console.log('done');
//         //     });
//         // });

//     });

//     Image.file('/media/steve/Windows/Users/alche/Documents/Lords of the Realm II/pl82png/PL8/Trp_xb_y.pl8').then(value => {
//         console.log(value.tiles.tiles[1]);
//     });

// });

// const ddata = fs.readFileSync('./data/VILLAGE.BMP.BASE01.256.PNG');

// console.log(ddata);
