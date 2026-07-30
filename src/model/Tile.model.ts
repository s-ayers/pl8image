import { GraphicFactory } from "../graphic-factory";
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

  public Orthogonal(palette: Buffer): Graphic {
    const data = this._orthogonal();

    const graphic = new Graphic(this.width, this.height, data, palette);
    return graphic;
  }

  /** Decode this tile via GraphicFactory (single ISO path). */
  public Isometric(palette: Buffer): Graphic {
    const savedX = this.x;
    const savedY = this.y;
    this.x = 0;
    this.y = 0;
    const graphic = GraphicFactory.tiles(
      [this],
      palette,
      Buffer.alloc(0),
      this.width,
      this.height + this.extraRows,
    );
    this.x = savedX;
    this.y = savedY;
    return graphic;
  }

  public Rle(): Buffer {
    const data = Buffer.alloc(this.width * this.height * 4);

    return data;
  }
}
