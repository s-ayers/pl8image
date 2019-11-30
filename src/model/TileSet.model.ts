import { Tile } from './Tile.model';

export class TileSet {

    tiles: Tile[] = [];
    width: number = 640;
    height: number = 480;
    
    add(ti: Tile) {
        this.tiles.push(ti);
    }

    Orthogonal(): Buffer {
        const rowSize =  Math.ceil(((3*this.width)/4));
        const imageData = Buffer.alloc(this.height * this.width, 0x0);

        // return imageData;
console.log(`Number of Tiles ${this.tiles.length}`);
        this.tiles.forEach(tile => {
            const width = tile.width,
                height = tile.height,
                x = tile.x,
                y = tile.y;
    
            // console.log(`Raw: ${tile.raw.length}`);
            // console.log(`imageData: ${imageData.length}`);

            for (let h = 0; h < height; h++) {
                for (let w = 0; w < width-1; w++) {
                    let source = (h * width) + w,
                        target = (this.width*(y + h) + (x + w));

                    // console.log(`Source: ${source}\t Target: ${target}`);
                    imageData.writeUInt8(tile.raw.readUInt8(source), target);

                }
            }
        });

        return imageData;
    }
}