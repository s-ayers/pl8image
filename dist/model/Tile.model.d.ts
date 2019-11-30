/// <reference types="node" />
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
    Orthogonal(): Buffer;
    Isometric(): Buffer;
    Rle(): Buffer;
}
