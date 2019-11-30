"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileSet = /** @class */ (function () {
    function TileSet() {
        this.tiles = [];
        this.width = 640;
        this.height = 480;
    }
    TileSet.prototype.add = function (ti) {
        this.tiles.push(ti);
    };
    TileSet.prototype.Orthogonal = function () {
        var _this = this;
        var rowSize = Math.ceil(((3 * this.width) / 4));
        var imageData = Buffer.alloc(this.height * this.width, 0x0);
        // return imageData;
        console.log("Number of Tiles " + this.tiles.length);
        this.tiles.forEach(function (tile) {
            var width = tile.width, height = tile.height, x = tile.x, y = tile.y;
            // console.log(`Raw: ${tile.raw.length}`);
            // console.log(`imageData: ${imageData.length}`);
            for (var h = 0; h < height; h++) {
                for (var w = 0; w < width - 1; w++) {
                    var source = (h * width) + w, target = (_this.width * (y + h) + (x + w));
                    // console.log(`Source: ${source}\t Target: ${target}`);
                    imageData.writeUInt8(tile.raw.readUInt8(source), target);
                }
            }
        });
        return imageData;
    };
    return TileSet;
}());
exports.TileSet = TileSet;
