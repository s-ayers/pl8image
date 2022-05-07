import {PNG} from "pngjs";

const { createBitmapBuffer } = require("@s-ayers/bitmap");

export class Graphic {
  constructor(
    private width: number,
    private height: number,
    private raw: Buffer,
    private palette: Buffer,
  ) {}

  public async toBMP(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buf = createBitmapBuffer({
        bitsPerPixel: 8,
        colorTable: this.palette,
        height: this.height * -1,
        imageData: this.raw,
        width: this.width,
      });
      resolve(buf);
    });
  }

  public async toPNG(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const options = { width: this.width, height: this.height };
      const newfile = new PNG(options);
      const bufs: any = [];
      // let buf: any;

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          let idx = this.width * y + x;

          const col = this.raw.readUInt8(idx);
          // console.log({idx1: idx, idx2: (idx<<2), idx3: (idx/4), idx4: (idx*4)} );
          // idx = idx << 2;
          idx = idx * 4;

          if (col !== 0) {
            newfile.data[idx] = this.palette.readUInt8(col * 4 + 2);
            newfile.data[idx + 1] = this.palette.readUInt8(col * 4 + 1);
            newfile.data[idx + 2] = this.palette.readUInt8(col * 4);
            newfile.data[idx + 3] = 0xff; // this.palette.readUInt8(col * 4 + 1);this.palette.readUInt8(col * 4 + 3);
          } else {
            newfile.data[idx] = 0;
            newfile.data[idx + 1] = 0;
            newfile.data[idx + 2] = 0;
            newfile.data[idx + 3] = 0;
          }
        }
      }

      resolve(PNG.sync.write(newfile));
    });
  }
}
