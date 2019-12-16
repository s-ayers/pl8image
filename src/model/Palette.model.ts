import * as fs from "fs";

export namespace Palette {

    export async function file(filename: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {

            fs.readFile(filename, (err, data) => {
                if (err) {
                    reject(err);
                }
                const palette = Buffer.alloc(256 * 4);
                for (let i = 0, k = 0, b = 0; i < 256; i++) {

                    if (i === 0) {
                        palette.writeUInt8(0xFF, b++); // pix.red = data.readUInt8(k++) << 2;
                        palette.writeUInt8(0xFF, b++); // pix.blue = data.readUInt8(k++) << 2;
                        palette.writeUInt8(0xFF, b++); // pix.green = data.readUInt8(k++) << 2;
                        palette.writeUInt8(0xFF, b++);
                    } else {
                        palette.writeUInt8(data.readUInt8(i * 3 + 2) << 2, b++); // pix.red = data.readUInt8(k++) << 2;
                        palette.writeUInt8(data.readUInt8(i * 3 + 1) << 2, b++); // pix.blue = data.readUInt8(k++) << 2;
                        palette.writeUInt8(data.readUInt8(i * 3) << 2, b++); // pix.green = data.readUInt8(k++) << 2;
                        palette.writeUInt8(0x00, b++);
                    }

                }
                resolve(palette);

            });
        });
    }

}
