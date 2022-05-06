import * as fs from "fs";
import {Graphic} from "./Graphic.model";
import {Tile} from "./Tile.model";

export namespace Image {
    export enum TYPE {
        ORTHOGONAL,
        RLE_ENCODED,
        ISOMETRIC,
    }

    export function file(filename: string): Promise<Pl8Image> {
        return new Promise((resolve) => {

            fs.readFile(filename, (err, data) => {
                if (err) { throw err; }

                const image = buffer(data);
                resolve(image);
            });

        });
    }

    export function buffer(data: Buffer): Pl8Image {

        let p = 0;
        const type = data.readUInt16LE(p); p += 2;
        const numberOfTile = data.readUInt16LE(p); p += 2;
        p += 4;
        const tiles: Tile[] = [];
        for (let i = 0; i < numberOfTile; i++) {

            const width  = data.readUInt16LE(p); p += 2;
            const height = data.readUInt16LE(p); p += 2;
            const offset = data.readUInt32LE(p); p += 4;

            const ti = new Tile(width, height, offset, data.slice(offset, offset + (width * height) - 1 ));

            ti.x = data.readUInt16LE(p); p += 2;
            ti.y = data.readUInt16LE(p); p += 2;

            ti.extraType = data.readUInt8(p); p += 1;
            ti.extraRows = data.readUInt8(p); p += 1;

            p += 2;

            tiles.push(ti);

        }
        const image = new Pl8Image(tiles, type);

        return image;
    }
    export  class Pl8Image {

        public tiles: Tile[] = [];
        public width: number = 640;
        public height: number = 480;
        public type: number;

        constructor(tiles: Tile[], type: number) {
            this.tiles = tiles;
            this.type = type;
        }
        public add(ti: Tile) {
            this.tiles.push(ti);
        }

        public Orthogonal(palette: Buffer): Graphic {
            const imageData = Buffer.alloc(this.height * this.width, 0x00);

            this.tiles.forEach((tile) => {
                const width = tile.width;
                const height = tile.height;
                const x = tile.x;
                const y = tile.y;
                const data = tile._orthogonal();

                for (let h = 0; h < height; h++) {
                    for (let w = 0; w < width - 1; w++) {
                        const source = (h * width) + w;
                        const target = (this.width * (y + h) + (x + w));

                        imageData.writeUInt8(data.readUInt8(source), target);

                    }
                }
            });

            const graphic = new Graphic(this.width, this.height, imageData, palette);
            return graphic;

        }

        public Isometric(palette: Buffer): Graphic {
            const imageData = Buffer.alloc(this.height * this.width, 0x00);

            this.tiles.forEach((tile) => {
                const width = tile.width;
                const height = tile.height;
                const x = tile.x;
                const y = tile.y;
                const data = tile._isometric();
                for (let h = 0; h < height; h++) {
                    for (let w = 0; w < width - 1; w++) {
                        const source = (h * width) + w;
                        const target = (this.width * (y + h) + (x + w));

                        imageData.writeUInt8(data.readUInt8(source), target);

                    }
                }
            });

            const graphic = new Graphic(this.width, this.height, imageData, palette);
            return graphic;

        }
    }
}
