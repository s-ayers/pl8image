/// <reference types="node" />
import { Tile } from './Tile.model';
export declare module Image {
    function file(filename: string): Promise<Pl8Image>;
    class Pl8Image {
        tiles: Tile[];
        width: number;
        height: number;
        constructor(tiles: Tile[]);
        add(ti: Tile): void;
        Orthogonal(palette: Buffer, format?: string): Buffer;
    }
}
