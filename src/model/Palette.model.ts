import fs from 'fs';
import {Pixel} from './Pixel.model';


 

 export module Palette {

    export async function file(filename: string): Promise<Pixel[]> {
        const palette: Pixel[] = [];
        return new Promise((resolve, reject) => {
    
            fs.readFile(filename, (err, data) => {
                if (err) {
                    reject(err);
                }
    
                for (let i = 0, k = 0; i < 256; i++) {
                    let pix = new Pixel()
                    pix.red = data.readUInt8(k++) << 2;
                    pix.blue = data.readUInt8(k++) << 2;
                    pix.green = data.readUInt8(k++) << 2;
                    
                    
                    
                    palette.push(pix);
                }
                resolve(palette);
                
            });
        });
    }

    export async function buffer(filename: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
    
            fs.readFile(filename, (err, data) => {
                if (err) {
                    reject(err);
                }
                let palette = Buffer.alloc(256*4);
                for (let i = 0, k = 0, b = 0; i < 256; i++) {
                    
                    
                    palette.writeUInt8(data.readUInt8(i*3 + 2) << 2, b++); //pix.red = data.readUInt8(k++) << 2;
                    palette.writeUInt8(data.readUInt8(i*3 + 1) << 2, b++); //pix.blue = data.readUInt8(k++) << 2;
                    palette.writeUInt8(data.readUInt8(i*3) << 2, b++);//pix.green = data.readUInt8(k++) << 2;
                    palette.writeUInt8(0xFF, b++);
                    
                    
                    // palette.push(pix);
                }
                resolve(palette);
                
            });
        });
    }

}