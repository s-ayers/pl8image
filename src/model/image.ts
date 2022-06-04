import { PNG } from "pngjs";

export class Image {
    public height: number;
    public width: number;
    protected buffer: Buffer;

    public toPng(palette: Buffer) {
        const transparent = 0;
        const options = { width: this.width, height: this.height };
        const newfile = new PNG(options);

        for (let y = 0; y < this.height; y += 1) {
          for (let x = 0; x < this.width; x += 1) {
            let idx = this.width * y + x;

            const color = this.buffer.readUInt8(idx);
            idx = idx * 4;

            if (color === transparent) {
              newfile.data[idx] = 0;
              newfile.data[idx + 1] = 0;
              newfile.data[idx + 2] = 0;
              newfile.data[idx + 3] = 0;
            } else {
              newfile.data[idx] = palette.readUInt8(color * 4 + 2);
              newfile.data[idx + 1] = palette.readUInt8(color * 4 + 1);
              newfile.data[idx + 2] = palette.readUInt8(color * 4);
              newfile.data[idx + 3] = 0xff;
            }
          }
        }

        return PNG.sync.write(newfile);
    }
}