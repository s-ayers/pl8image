"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
var graphic_factory_1 = require("../graphic-factory");
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
    Tile.prototype.Orthogonal = function (palette) {
        var data = this._orthogonal();
        var graphic = new Graphic_model_1.Graphic(this.width, this.height, data, palette);
        return graphic;
    };
    /** Decode this tile via GraphicFactory (single ISO path). */
    Tile.prototype.Isometric = function (palette) {
        var savedX = this.x;
        var savedY = this.y;
        this.x = 0;
        this.y = 0;
        var graphic = graphic_factory_1.GraphicFactory.tiles([this], palette, Buffer.alloc(0), this.width, this.height + this.extraRows);
        this.x = savedX;
        this.y = savedY;
        return graphic;
    };
    Tile.prototype.Rle = function () {
        var data = Buffer.alloc(this.width * this.height * 4);
        return data;
    };
    return Tile;
}());
exports.Tile = Tile;
