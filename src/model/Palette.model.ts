import * as fs from 'fs';

 export module Palette {


    export async function file(filename: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
    
            fs.readFile(filename, (err, data) => {
                if (err) {
                    reject(err);
                }
                let palette = Buffer.alloc(256*4);
                for (let i = 0, k = 0, b = 0; i < 256; i++) {
                    
                    let default_alpha = 0xFF;
                    if (i === 0) {
                        default_alpha = 0x00;
                    }
                    
                    palette.writeUInt8(data.readUInt8(i*3 + 2) << 2, b++); //pix.red = data.readUInt8(k++) << 2;
                    palette.writeUInt8(data.readUInt8(i*3 + 1) << 2, b++); //pix.blue = data.readUInt8(k++) << 2;
                    palette.writeUInt8(data.readUInt8(i*3) << 2, b++);//pix.green = data.readUInt8(k++) << 2;
                    palette.writeUInt8(default_alpha, b++);
                    
                    
                }
                resolve(palette);
                
            });
        });
    }

}