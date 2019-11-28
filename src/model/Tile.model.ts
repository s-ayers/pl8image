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
// console.log((this.raw.length+1)/this.height);
            let data = Buffer.alloc(this.width * this.height);
            let size = data.length;
            console.log(size/this.height);
            for (let h = 0; h < this.height; h++) {

                let targetStart = h*this.width, 
                sourceStart = h*(this.width),
                sourceEnd = (h+1)*this.width+1;

                console.log(targetStart/this.height, sourceStart, sourceEnd);
                this.raw.copy(data, targetStart, sourceStart , sourceEnd  );
            }

            return data;
    
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