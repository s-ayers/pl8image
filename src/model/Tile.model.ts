import {Palette} from './Palette.model';
import { Pixel } from './Pixel.model';

export class Tile {

    width: number = 0;
	height: number = 0;
	offset: number = 0;
	x: number = 0;
	y: number = 0;
	extraType: number = 0;
	extraRows: number = 0;
    raw: Buffer;
 
         constructor(width: number, height: number, offset: number, raw: Buffer) {
            this.width = width;
            this.height = height;
            this.offset = offset;

            this.raw = raw;
         }
         
         Orthogonal(): Buffer {
            return this.raw;
        }
    
        Isometric(): Buffer {
            let data = Buffer.alloc(this.width * this.height *4);


            return data;
        }
    
        Rle(): Buffer {
            let data = Buffer.alloc(this.width * this.height * 4);


            return data;
        }

}