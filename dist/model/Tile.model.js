"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tile = /** @class */ (function () {
    function Tile(width, height, offset, raw) {
        this.width = 0;
        this.height = 0;
        this.offset = 0;
        this.x = 0;
        this.y = 0;
        this.extraType = 0;
        this.extraRows = 0;
        this.width = width;
        this.height = height;
        this.offset = offset;
        this.raw = raw;
    }
    Tile.prototype.Orthogonal = function () {
        return this.raw;
    };
    Tile.prototype.Isometric = function () {
        var data = Buffer.alloc(this.width * this.height * 4);
        return data;
    };
    Tile.prototype.Rle = function () {
        var data = Buffer.alloc(this.width * this.height * 4);
        return data;
    };
    return Tile;
}());
exports.Tile = Tile;
