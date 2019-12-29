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
var Graphic_model_1 = require("./Graphic.model");
var Tile_model_1 = require("./Tile.model");
var Image;
(function (Image) {
    var TYPE;
    (function (TYPE) {
        TYPE[TYPE["ORTHOGONAL"] = 0] = "ORTHOGONAL";
        TYPE[TYPE["RLE_ENCODED"] = 1] = "RLE_ENCODED";
        TYPE[TYPE["ISOMETRIC"] = 2] = "ISOMETRIC";
    })(TYPE = Image.TYPE || (Image.TYPE = {}));
    function file(filename) {
        return new Promise(function (resolve) {
            fs.readFile(filename, function (err, data) {
                if (err) {
                    throw err;
                }
                var image = buffer(data);
                resolve(image);
            });
        });
    }
    Image.file = file;
    function buffer(data) {
        // console.log(data.readUInt32LE(4));
        var p = 0;
        var type = data.readUInt16LE(p);
        p += 2;
        var numberOfTile = data.readUInt16LE(p);
        p += 2;
        p += 4;
        var tiles = [];
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
            tiles.push(ti);
        }
        var image = new Pl8Image(tiles, type);
        return image;
    }
    Image.buffer = buffer;
    var Pl8Image = /** @class */ (function () {
        function Pl8Image(tiles, type) {
            this.tiles = [];
            this.width = 640;
            this.height = 480;
            this.tiles = tiles;
            this.type = type;
        }
        Pl8Image.prototype.add = function (ti) {
            this.tiles.push(ti);
        };
        Pl8Image.prototype.Orthogonal = function (palette) {
            var _this = this;
            var imageData = Buffer.alloc(this.height * this.width, 0x00);
            this.tiles.forEach(function (tile) {
                var width = tile.width, height = tile.height, x = tile.x, y = tile.y, data = tile._orthogonal();
                for (var h = 0; h < height; h++) {
                    for (var w = 0; w < width - 1; w++) {
                        var source = (h * width) + w;
                        var target = (_this.width * (y + h) + (x + w));
                        imageData.writeUInt8(data.readUInt8(source), target);
                    }
                }
            });
            var graphic = new Graphic_model_1.Graphic(this.width, this.height, imageData, palette);
            return graphic;
        };
        return Pl8Image;
    }());
    Image.Pl8Image = Pl8Image;
})(Image = exports.Image || (exports.Image = {}));
