"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Graphic_model_1 = require("./Graphic.model");
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
    Tile.prototype._orthogonal = function () {
        return this.raw;
    };
    Tile.prototype._isometric = function () {
        var p = this.offset;
        var isometricBuf = Buffer.alloc(this.width * this.height);
        var halfHeight = this.height / 2;
        // Fill top half
        for (var y = 0; y < halfHeight; y += 1) {
            var rowStart = (halfHeight - 1 - y) * 2;
            var rowStop = rowStart + y * 4 + 2;
            for (var x = rowStart; x < rowStop; x += 1) {
                var target = (y + this.extraRows) * this.width + x;
                this.raw.copy(isometricBuf, p, target, 1);
                p += 1;
            }
        }
        return isometricBuf;
    };
    Tile.prototype.Orthogonal = function (palette) {
        var data = this._orthogonal();
        var graphic = new Graphic_model_1.Graphic(this.width, this.height, data, palette);
        return graphic;
    };
    Tile.prototype.Isometric = function (palette) {
        var data = this._isometric();
        var graphic = new Graphic_model_1.Graphic(this.width, this.height, data, palette);
        return graphic;
    };
    Tile.prototype.Rle = function () {
        var data = Buffer.alloc(this.width * this.height * 4);
        return data;
    };
    return Tile;
}());
exports.Tile = Tile;
