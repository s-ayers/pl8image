import * as fs from "fs";
import { GraphicFactory } from "../graphic-factory";
import { Graphic } from "./Graphic.model";
import { Tile } from "./Tile.model";

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

            const x = data.readUInt16LE(p); p += 2;
            const y = data.readUInt16LE(p); p += 2;

            const extraType = data.readUInt8(p); p += 1;
            const extraRows = data.readUInt8(p); p += 1;

            p += 2;

            let raw: Buffer;
            if (type === TYPE.RLE_ENCODED) {
                // Bound after all headers are known (next tile offset / EOF).
                raw = Buffer.alloc(0);
            } else if (type === TYPE.ISOMETRIC) {
                const size = isoTileSize(extraType, width, height, extraRows);
                raw = data.slice(offset, offset + size);
            } else {
                raw = data.slice(offset, offset + width * height);
            }

            const ti = new Tile(width, height, offset, raw);
            ti.x = x;
            ti.y = y;
            ti.extraType = extraType;
            ti.extraRows = extraRows;

            tiles.push(ti);

        }

        if (type === TYPE.RLE_ENCODED) {
            for (let i = 0; i < tiles.length; i++) {
                const end = GraphicFactory.rlePayloadEnd(
                    tiles,
                    i,
                    data.length,
                );
                tiles[i].raw = data.slice(tiles[i].offset, end);
            }
        }

        const image = new Pl8Image(tiles, type);
        image.source = data;

        return image;
    }

    /** Packed ISO payload length — mirrors GraphicFactory.tileSize. */
    function isoTileSize(
        extraType: number,
        width: number,
        height: number,
        rows: number,
    ): number {
        switch (extraType) {
            case 2:
                return height * height + rows * width;
            case 3:
            case 4:
                return height * height + rows * (width / 2 + 1);
            case 1:
            default:
                return height * height;
        }
    }

    export  class Pl8Image {

        public tiles: Tile[] = [];
        public width: number = 640;
        public height: number = 480;
        public type: number;
        /** Original file buffer; used when re-slicing tile payloads. */
        public source?: Buffer;

        constructor(tiles: Tile[], type: number) {
            this.tiles = tiles;
            this.type = type;
        }
        public add(ti: Tile) {
            this.tiles.push(ti);
        }

        public Orthogonal(palette: Buffer): Graphic {
            return GraphicFactory.Pl8(this, palette, this.source);
        }

        public Rle(palette: Buffer): Graphic {
            return GraphicFactory.Pl8(this, palette, this.source);
        }

        public Isometric(palette: Buffer): Graphic {
            return GraphicFactory.Pl8(this, palette, this.source);
        }
    }
}
