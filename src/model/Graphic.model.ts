
import * as fs from "fs";

const { createBitmapBuffer } = require("@s-ayers/bitmap");
const PNG = require("pngjs").PNG;

export class Graphic {
  constructor(private width: number, private height: number, private raw: Buffer, private palette: Buffer) {

  }

  public toBMP(): Buffer {

    return createBitmapBuffer({
      bitsPerPixel: 8,
      colorTable: this.palette,
      height: this.height * -1,
      imageData: this.raw,
      width: this.width,
    });
  }

  public toPNG(): Buffer {
    const options = { width: this.width, height: this.height};
    const newfile = new PNG(options);
    const bufs: any = [];
    let buf: any;
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let idx = (this.width * y + x);

        const col = this.raw.readUInt8(idx);
        idx = idx << 2;
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

    newfile.pack().pipe(fs.createWriteStream("./data/out.png"));

    // newfile.readable.on('data', (d:any) => { bufs.push(d); });
    // newfile.readable.on('end', () => {
    //   buf = Buffer.concat(bufs);
    // });

    // newfile.pack();

    // var buffer = PNG.sync.write(newfile.data, options);

    return buf;
  }
}
