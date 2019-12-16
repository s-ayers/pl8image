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
             const orthogonalBuf = Buffer.alloc(this.width * this.height);

             for (let h = this.height; h > 0; h -= 1) {
                this.raw.copy(orthogonalBuf, (h - 1) * this.width, (this.height - h) * this.width, (this.height - h + 1) * this.width + 1 );
            }

             return orthogonalBuf;
        }

        public Orthogonal(palette: Buffer): Graphic {
            const data = this._orthogonal();

            const graphic = new Graphic(this.width, this.height, data, palette);
            return graphic;
         }

        public Isometric(): Buffer {
            const data = Buffer.alloc(this.width * this.height * 4);

            return data;
        }

        public Rle(): Buffer {
            const data = Buffer.alloc(this.width * this.height * 4);

            return data;
        }

}
