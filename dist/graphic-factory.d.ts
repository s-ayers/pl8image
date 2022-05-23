/// <reference types="node" />
import { Graphic } from "./model/Graphic.model";
import { Image } from "./model/Pl8.model";
import { Tile } from "./model/Tile.model";
export declare class GraphicFactory {
    static tiles(tiles: Tile[], palette: Buffer, buf: Buffer, width?: number, height?: number): Graphic;
    static Pl8(pl8: Image.Pl8Image, palette: Buffer): Graphic | undefined;
    protected static orthogonalImage(pl8: Image.Pl8Image, palette: Buffer): Graphic;
    protected static isometriclImage(pl8: Image.Pl8Image, palette: Buffer): Graphic;
    protected static RleImage(pl8: Image.Pl8Image, palette: Buffer): Graphic;
    protected static tileSize(type: number, width: number, height: number, rows: number): number;
    protected static orthogonal(tile: Tile, buf: Buffer, width: number): void;
    protected static isometric(tile: Tile, buf: Buffer, width: number): void;
    protected static isometricExtra(tile: Tile, buf: Buffer, width: number): void;
    protected static isometricLeft(tile: Tile, buf: Buffer, width: number): void;
    protected static isometricRight(tile: Tile, buf: Buffer, width: number): void;
    protected static isometricTop(tile: Tile, buf: Buffer, width: number): void;
    protected static isometricBottom(tile: Tile, buf: Buffer, width: number): void;
    protected static runLengthEncoded(tile: Tile, buf: Buffer, width: number): void;
}
