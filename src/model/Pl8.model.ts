import * as fs from 'fs';
import {Tile} from './Tile.model';
const { createBitmapBuffer } = require('@s-ayers/bitmap');

export module Image {

    export function file(filename: string): Promise<Pl8Image> {
        return new Promise((resolve) => {


            let tiles: Tile[] = [];
            fs.readFile(filename, (err, data) => {
                if (err) throw err;
    
                let p = 2;
                let numberOfTile = data.readUInt16LE(p); p+=2;
                p+=4;
    
                for (let i = 0; i < numberOfTile; i++) {
    
                    
                    
                    let width  = data.readUInt16LE(p); p+=2;
                    let height = data.readUInt16LE(p); p+=2;
                    let offset = data.readUInt32LE(p); p+=4;

                    
                    // let ti = new Tile(width, height, offset, data.slice(offset, offset+(width*height)-1 ));
                    let ti = new Tile(width, height, offset, data.slice(offset, offset+(width*height) - 1 ));
                        
                    ti.x = data.readUInt16LE(p); p+=2;
                    ti.y = data.readUInt16LE(p); p+=2;
                    
                    ti.extraType = data.readUInt8(p); p+=1;
                    ti.extraRows = data.readUInt8(p); p+=1;
    
                    p+=2;
                    
                    tiles.push(ti); 
                    
                }
                const image = new Pl8Image(tiles);
                resolve(image);
            });
            
        });
    }

    export  class Pl8Image {
    
        tiles: Tile[] = [];
        width: number = 640;
        height: number = 480;
        
    
        constructor(tiles: Tile[]) {
            this.tiles = tiles;
        }
        add(ti: Tile) {
            this.tiles.push(ti);
        }
    
        Orthogonal(palette: Buffer, format:string = 'bmp'): Buffer {
            const imageData = Buffer.alloc(this.height * this.width, 0xFF);
    
            this.tiles.forEach(tile => {
                const width = tile.width,
                    height = tile.height,
                    x = tile.x,
                    y = tile.y;
        
                for (let h = 0; h < height; h++) {
                    for (let w = 0; w < width-1; w++) {
                        let source = (h * width) + w,
                            target = (this.width*(y + h) + (x + w));
    
                        imageData.writeUInt8(tile.raw.readUInt8(source), target);
    
                    }
                }
            });
            let image;
            if (format === 'bmp') {
                image = createBitmapBuffer({
                    imageData: imageData,
                    width: this.width,
                    height: this.height*-1,
                    bitsPerPixel: 8,
                    colorTable: palette
                  });
            } else {
                throw Error('Invalid Argument - format');
            }
            return image;
        }
       
    }
}

