/// <reference types="node" />
import { Graphic } from "./model/Graphic.model";
import { Image } from "./model/Pl8.model";
import { Tile } from "./model/Tile.model";
export declare class GraphicFactory {
    static tiles(tiles: Tile[], palette: Buffer, buf: Buffer, width?: number, height?: number): Graphic;
    static Pl8(pl8: Image.Pl8Image, palette: Buffer, buf?: Buffer): Graphic;
    protected static orthogonalImage(pl8: Image.Pl8Image, palette: Buffer, buf?: Buffer): Graphic;
    /**
     * End offset of an RLE tile payload: next tile's offset, or EOF.
     * Stream length is not in the header; game files pack tiles back-to-back.
     */
    static rlePayloadEnd(tiles: Tile[], index: number, bufLength: number): number;
    protected static rleImage(pl8: Image.Pl8Image, palette: Buffer, buf?: Buffer): Graphic;
    static tileSize(type: number, width: number, height: number, rows: number): number;
    protected static blitTile(tile: Tile, buf: Buffer, width: number): void;
    protected static orthogonal(tile: Tile, buf: Buffer, width: number): void;
    /**
     * Diamond-only ISO (extraType 1). Sequential packed rows; no magic offsets.
     */
    protected static isometric(tile: Tile, buf: Buffer, width: number): void;
    /**
     * ISO with extras (extraType 2 both, 3 left, 4 right) per docs/.pl8.rst.
     */
    protected static isometricWithExtras(tile: Tile, buf: Buffer, width: number): void;
    /**
     * Unpack one isometric tile onto the canvas.
     * Matches the C++ sample in docs/.pl8.rst: top half, bottom half, then
     * optional diagonal extra rows. Diamond rows are placed at y + extraRows.
     */
    protected static decodeIsometric(tile: Tile, buf: Buffer, canvasWidth: number, withExtras: boolean): void;
    protected static runLengthEncoded(tile: Tile, buf: Buffer, width: number): void;
}
