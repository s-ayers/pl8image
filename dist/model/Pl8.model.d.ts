import { TileSet } from './TileSet.model';
export declare module Image {
    function file(filename: string): Promise<Pl8Image>;
    class Pl8Image {
        numberOfTile: number;
        tiles: TileSet;
        constructor(tiles: TileSet);
    }
}
