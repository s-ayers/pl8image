"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var TileSet_model_1 = require("./TileSet.model");
var Tile_model_1 = require("./Tile.model");
var Image;
(function (Image) {
    function file(filename) {
        return new Promise(function (resolve, reject) {
            var tiles = new TileSet_model_1.TileSet();
            fs.readFile(filename, function (err, data) {
                if (err)
                    throw err;
                var p = 2;
                var numberOfTile = data.readUInt16LE(p);
                p += 2;
                p += 4;
                for (var i = 0; i < numberOfTile; i++) {
                    var width = data.readUInt16LE(p);
                    p += 2;
                    var height = data.readUInt16LE(p);
                    p += 2;
                    var offset = data.readUInt32LE(p);
                    p += 4;
                    // let ti = new Tile(width, height, offset, data.slice(offset, offset+(width*height)-1 ));
                    var ti = new Tile_model_1.Tile(width, height, offset, data.slice(offset, offset + (width * height) - 1));
                    ti.x = data.readUInt16LE(p);
                    p += 2;
                    ti.y = data.readUInt16LE(p);
                    p += 2;
                    ti.extraType = data.readUInt8(p);
                    p += 1;
                    ti.extraRows = data.readUInt8(p);
                    p += 1;
                    p += 2;
                    tiles.add(ti);
                }
                var image = new Pl8Image(tiles);
                image.numberOfTile = numberOfTile;
                resolve(image);
            });
        });
    }
    Image.file = file;
    var Pl8Image = /** @class */ (function () {
        function Pl8Image(tiles) {
            this.numberOfTile = 0;
            this.tiles = tiles;
        }
        return Pl8Image;
    }());
    Image.Pl8Image = Pl8Image;
})(Image = exports.Image || (exports.Image = {}));
