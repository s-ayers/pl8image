"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
var graphic_factory_1 = require("../graphic-factory");
var Graphic_model_1 = require("./Graphic.model");
var Pl8_model_1 = require("./Pl8.model");
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
    /** Decode this tile via GraphicFactory (single RLE path). */
    Tile.prototype.Rle = function (palette) {
        var savedX = this.x;
        var savedY = this.y;
        this.x = 0;
        this.y = 0;
        var pl8 = new Pl8_model_1.Image.Pl8Image([this], Pl8_model_1.Image.TYPE.RLE_ENCODED);
        pl8.width = this.width;
        pl8.height = this.height;
        var graphic = graphic_factory_1.GraphicFactory.Pl8(pl8, palette);
        this.x = savedX;
        this.y = savedY;
        return graphic;
    };
    return Tile;
}());
exports.Tile = Tile;
