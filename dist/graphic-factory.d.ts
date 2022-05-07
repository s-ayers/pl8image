/// <reference types="node" />
import { Graphic } from "./model/Graphic.model";
import { Tile } from "./model/Tile.model";
export declare class GraphicFactory {
    static tiles(tiles: Tile[], palette: Buffer, buf: Buffer, width?: number, height?: number): Graphic;
    protected static tileSize(type: number, width: number, height: number, rows: number): number;
    protected static orthogonal(tile: Tile, buf: Buffer, width: number): void;
    protected static isometric(tile: Tile, buf: Buffer, width: number): void;
    protected static isometricExtra(tile: Tile, buf: Buffer, width: number): void;
    protected static isometricLeft(tile: Tile, buf: Buffer, width: number): void;
    protected static isometricRight(tile: Tile, buf: Buffer, width: number): void;
}
