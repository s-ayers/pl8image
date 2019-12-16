/// <reference types="node" />
export declare class Graphic {
    private width;
    private height;
    private raw;
    private palette;
    constructor(width: number, height: number, raw: Buffer, palette: Buffer);
    toBMP(): Buffer;
    toPNG(): Buffer;
}
