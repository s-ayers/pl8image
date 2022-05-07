import { Graphic } from "./Graphic.model";

export class Tile {
  public width: number = 0;
  public height: number = 0;
  public offset: number = 0;
  public x: number = 0;
  public y: number = 0;

  public extraType: number = 0;
  public extraRows: number = 0;
  public raw: Buffer;

  constructor(width: number, height: number, offset: number, raw: Buffer) {
    this.width = width;
    this.height = height;
    this.offset = offset;

    this.raw = raw;
  }

  public _orthogonal(): Buffer {
    return this.raw;
  }

  public _isometric(): Buffer {
    let p = this.offset;
    const isometricBuf = Buffer.alloc(this.width * this.height);
    const halfHeight = this.height / 2;
    // Fill top half
    for (let y = 0; y < halfHeight; y += 1) {
      const rowStart = (halfHeight - 1 - y) * 2;
      const rowStop = rowStart + y * 4 + 2;

      for (let x = rowStart; x < rowStop; x += 1) {
        const target = (y + this.extraRows) * this.width + x;
        this.raw.copy(isometricBuf, p, target, 1);
        p += 1;
      }
    }

    return isometricBuf;
  }

  public Orthogonal(palette: Buffer): Graphic {
    const data = this._orthogonal();

    const graphic = new Graphic(this.width, this.height, data, palette);
    return graphic;
  }

  public Isometric(palette: Buffer): Graphic {
    const data = this._isometric();

    const graphic = new Graphic(this.width, this.height, data, palette);
    return graphic;
  }

  public Rle(): Buffer {
    const data = Buffer.alloc(this.width * this.height * 4);

    return data;
  }
}
