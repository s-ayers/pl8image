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
        var orthogonalBuf = Buffer.alloc(this.width * this.height);
        for (var h = this.height; h > 0; h -= 1) {
            this.raw.copy(orthogonalBuf, (h - 1) * this.width, (this.height - h) * this.width, (this.height - h + 1) * this.width + 1);
        }
        return orthogonalBuf;
    };
    Tile.prototype.Orthogonal = function (palette) {
        var data = this._orthogonal();
        var graphic = new Graphic_model_1.Graphic(this.width, this.height, data, palette);
        return graphic;
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
