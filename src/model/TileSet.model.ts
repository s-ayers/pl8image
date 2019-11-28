import {Tile} from './Tile.model';

export class TileSet {
    tiles: Tile[] = [];

    add(ti: Tile) {
        this.tiles.push(ti);
    }

    // Orthogonal(palette: Pixel[]): Buffer {

    // }
}