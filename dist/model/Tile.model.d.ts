/// <reference types="node" />
import { Graphic } from "./Graphic.model";
export declare class Tile {
    width: number;
    height: number;
    offset: number;
    x: number;
    y: number;
    extraType: number;
    extraRows: number;
    raw: Buffer;
    constructor(width: number, height: number, offset: number, raw: Buffer);
    _orthogonal(): Buffer;
    Orthogonal(palette: Buffer): Graphic;
    /** Decode this tile via GraphicFactory (single ISO path). */
    Isometric(palette: Buffer): Graphic;
    Rle(): Buffer;
}
