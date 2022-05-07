/// <reference types="node" />
import { Graphic } from "./Graphic.model";
import { Tile } from "./Tile.model";
export declare namespace Image {
    enum TYPE {
        ORTHOGONAL = 0,
        RLE_ENCODED = 1,
        ISOMETRIC = 2
    }
    function file(filename: string): Promise<Pl8Image>;
    function buffer(data: Buffer): Pl8Image;
    class Pl8Image {
        tiles: Tile[];
        width: number;
        height: number;
        type: number;
        constructor(tiles: Tile[], type: number);
        add(ti: Tile): void;
        Orthogonal(palette: Buffer): Graphic;
        Isometric(palette: Buffer): Graphic;
    }
}
