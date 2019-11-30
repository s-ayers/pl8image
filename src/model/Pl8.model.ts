import * as fs from 'fs';
import { TileSet } from './TileSet.model';
import {Tile} from './Tile.model';

export module Image {

    export function file(filename: string): Promise<Pl8Image> {
        return new Promise((resolve, reject) => {


            let tiles = new TileSet();
            fs.readFile(filename, (err, data) => {
                if (err) throw err;
    
                let p = 2;
                let numberOfTile = data.readUInt16LE(p); p+=2;
                p+=4;
    
                for (let i = 0; i < numberOfTile; i++) {
    
                    
                    
                    let width  = data.readUInt16LE(p); p+=2;
                    let height = data.readUInt16LE(p); p+=2;
                    let offset = data.readUInt32LE(p); p+=4;

                    
                    // let ti = new Tile(width, height, offset, data.slice(offset, offset+(width*height)-1 ));
                    let ti = new Tile(width, height, offset, data.slice(offset, offset+(width*height) - 1 ));
                        
                    ti.x = data.readUInt16LE(p); p+=2;
                    ti.y = data.readUInt16LE(p); p+=2;
                    
                    ti.extraType = data.readUInt8(p); p+=1;
                    ti.extraRows = data.readUInt8(p); p+=1;
    
                    p+=2;
                    
                    tiles.add(ti); 
                    
                }
                const image = new Pl8Image(tiles);
                image.numberOfTile = numberOfTile;
                resolve(image);
            });
            
        });
    }

    export  class Pl8Image {
    
        numberOfTile: number = 0;
        tiles: TileSet;
        
    
        constructor(tiles: TileSet) {
            this.tiles = tiles;
        }
    
       
    }
}

