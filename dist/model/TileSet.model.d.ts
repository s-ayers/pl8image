/// <reference types="node" />
import { Tile } from './Tile.model';
export declare class TileSet {
    tiles: Tile[];
    width: number;
    height: number;
    add(ti: Tile): void;
    Orthogonal(): Buffer;
}
