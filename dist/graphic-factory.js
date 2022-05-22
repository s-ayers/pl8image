"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphicFactory = void 0;
var Graphic_model_1 = require("./model/Graphic.model");
var GraphicFactory = /** @class */ (function () {
    function GraphicFactory() {
    }
    GraphicFactory.tiles = function (tiles, palette, buf, width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        tiles.forEach(function (tile) {
            if (typeof tile.raw === "undefined") {
                var size = GraphicFactory.tileSize(tile.extraType, tile.width, tile.height, tile.extraRows);
                tile.raw = buf.slice(tile.offset, tile.offset + size);
            }
            var localWidth = tile.x + tile.width;
            if (localWidth > width) {
                width = localWidth;
            }
            var localHeight = tile.y + tile.height;
            if (localHeight > height) {
                height = localHeight;
            }
        });
        var imageData = Buffer.alloc(height * width, 0x00);
        tiles.forEach(function (tile) {
            switch (tile.extraType) {
                case 0:
                    GraphicFactory.orthogonal(tile, imageData, width);
                    break;
                case 1:
                    GraphicFactory.isometric(tile, imageData, width);
                    break;
                case 2:
                    GraphicFactory.isometricExtra(tile, imageData, width);
                    break;
                case 3:
                    GraphicFactory.isometricLeft(tile, imageData, width);
                    break;
                case 4:
                    GraphicFactory.isometricRight(tile, imageData, width);
                    break;
            }
        });
        var graphic = new Graphic_model_1.Graphic(width, height, imageData, palette);
        return graphic;
    };
    //   public static tile(tile: Tile, buf: Buffer) {}
    GraphicFactory.tileSize = function (type, width, height, rows) {
        var size;
        switch (type) {
            case 0:
                size = width * height;
                break;
            case 2:
                size = height * height + rows * width;
                break;
            case 3:
            case 4:
                size = height * height + rows * (width / 2 + 1);
                break;
            case 1:
            default:
                size = height * height;
                break;
        }
        return size;
    };
    GraphicFactory.orthogonal = function (tile, buf, width) {
        var tileWidth = tile.width;
        var tileHeight = tile.height;
        var x = tile.x;
        var y = tile.y;
        var data = tile.raw;
        for (var h = 0; h < tileHeight; h++) {
            for (var w = 0; w < tileWidth - 1; w++) {
                var source = h * tileWidth + w;
                if (source >= data.length) {
                    console.log("source is large than buffer - orthogonal");
                    break;
                }
                var target = width * (y + h) + (x + w);
                buf.writeUInt8(data.readUInt8(source), target);
            }
        }
    };
    GraphicFactory.isometric = function (tile, buf, width) {
        var tileWidth = tile.width;
        var tileHeight = tile.height;
        var x = tile.x;
        var y = tile.y;
        var data = tile.raw;
        var halfHeight = tileHeight / 2;
        // Fill top half
        var source = 0;
        for (var h = 0; h < halfHeight; h += 1) {
            var rowStart = (halfHeight - 1 - h) * 2;
            var rowStop = rowStart + h * 4 + 2;
            for (var w = rowStart; w < rowStop; w++) {
                if (source >= data.length) {
                    console.log("source is large than buffer - isometric - top");
                    break;
                }
                var value = data.readUInt8(source++);
                var target = width * (y + h) + (x + w);
                buf.writeUInt8(value, target);
            }
        }
        // fill bottom
        for (var h = halfHeight; h < tileHeight; h += 1) {
            var rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
            var rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;
            for (var w = rowStart; w < rowStop; w++) {
                var value = data.readUInt8(source++);
                var target = width * (y + h) + (x + w);
                buf.writeUInt8(value, target);
            }
        }
    };
    GraphicFactory.isometricExtra = function (tile, buf, width) {
        var rightBound = tile.x + tile.width;
        var tileHeight = tile.height;
        var x = tile.x;
        var y = tile.y;
        var data = tile.raw;
        var halfHeight = tileHeight / 2;
        var halfWidth = tile.width / 2;
        // Fill top half
        var source = 0;
        for (var h = 0; h < halfHeight; h += 1) {
            var rowStart = (halfHeight - 1 - h) * 2;
            var rowStop = rowStart + h * 4 + 2;
            for (var w = rowStart; w < rowStop; w++) {
                var value = data.readUInt8(source++);
                var target = width * (y + h) + (x + w);
                buf.writeUInt8(value, target);
            }
        }
        // fill bottom
        for (var h = halfHeight; h < tileHeight; h += 1) {
            var rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
            var rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;
            for (var w = rowStart; w < rowStop; w += 1) {
                var value = data.readUInt8(source++);
                var target = width * (y + h) + (x + w);
                buf.writeUInt8(value, target);
            }
        }
        // Fill Extra
        if (data.length > source) {
            for (var i = 0, h = halfHeight - 1; i < tile.extraRows; i += 1) {
                var rowStart = (halfHeight - 1 - h) * 2;
                var rowStop = rowStart + h * 4 + 2;
                for (var w = 0; w < tile.width; w += 1) {
                    if (source >= data.length) {
                        console.log("source is large than buffer - isometricextra - extra");
                        console.log({ w: w, h: h, x: x, y: y });
                        console.log(tile);
                        break;
                        break;
                    }
                    var value = data.readUInt8(source++);
                    var target = width * (y + h) + (x + w);
                    if (w % 2 === 1) {
                        if (w < halfWidth) {
                            h -= 1;
                        }
                        else {
                            h += 1;
                        }
                    }
                    buf.writeUInt8(value, target);
                }
                h = halfHeight - i - 1;
            }
        }
    };
    GraphicFactory.isometricLeft = function (tile, buf, width) {
        var tileWidth = tile.width;
        var tileHeight = tile.height;
        var x = tile.x;
        var y = tile.y;
        var data = tile.raw;
        var halfHeight = tileHeight / 2;
        var halfWidth = tile.width / 2;
        // Fill top half
        var source = 0;
        for (var h = 0; h < halfHeight; h += 1) {
            var rowStart = (halfHeight - 1 - h) * 2;
            var rowStop = rowStart + h * 4 + 2;
            for (var w = rowStart; w < rowStop; w++) {
                var value = data.readUInt8(source++);
                var target = width * (y + h) + (x + w);
                buf.writeUInt8(value, target);
            }
        }
        // fill bottom
        for (var h = halfHeight; h < tileHeight; h += 1) {
            var rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
            var rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;
            for (var w = rowStart; w < rowStop; w++) {
                var value = data.readUInt8(source++);
                var target = width * (y + h) + (x + w);
                buf.writeUInt8(value, target);
            }
        }
        // Fill Extra
        if (data.length > source) {
            for (var i = 2, h = halfHeight - i; i < tile.extraRows; i += 1) {
                var rowStart = (halfHeight - 1 - h) * 2;
                var rowStop = rowStart + h * 4 + 2;
                for (var w = 0; w < halfWidth + 1; w += 1) {
                    if (source >= data.length) {
                        console.log("source is large than buffer - isometricleft - extra");
                        break;
                    }
                    var value = data.readUInt8(source++);
                    var target = width * (y + h) + (x + w);
                    if (w % 2 === 1) {
                        h -= 1;
                    }
                    buf.writeUInt8(value, target);
                }
                h = halfHeight - i;
            }
        }
    };
    GraphicFactory.isometricRight = function (tile, buf, width) {
        var tileWidth = tile.width;
        var tileHeight = tile.height;
        var x = tile.x;
        var y = tile.y;
        var data = tile.raw;
        var halfHeight = tileHeight / 2;
        var halfWidth = tile.width / 2;
        // Fill top half
        var source = 0;
        for (var h = 0; h < halfHeight; h += 1) {
            var rowStart = (halfHeight - 1 - h) * 2;
            var rowStop = rowStart + h * 4 + 2;
            for (var w = rowStart; w < rowStop; w++) {
                var value = data.readUInt8(source++);
                var target = width * (y + h) + (x + w);
                buf.writeUInt8(value, target);
            }
        }
        // fill bottom
        for (var h = halfHeight; h < tileHeight; h += 1) {
            var rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
            var rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;
            for (var w = rowStart; w < rowStop; w++) {
                var value = data.readUInt8(source++);
                var target = width * (y + h) + (x + w);
                buf.writeUInt8(value, target);
            }
        }
        // Fill Extra
        if (data.length > source) {
            for (var i = 1, h = 0 - i; i < tile.extraRows; i += 1) {
                var rowStart = (halfHeight - 1 - h) * 2;
                var rowStop = rowStart + h * 4 + 2;
                for (var w = halfWidth - 1; w < tile.width; w += 1) {
                    var value = data.readUInt8(source++);
                    var target = width * (y + h) + (x + w);
                    if (w % 2 === 1) {
                        h += 1;
                    }
                    buf.writeUInt8(value, target);
                }
                h = 0 - i;
            }
        }
    };
    return GraphicFactory;
}());
exports.GraphicFactory = GraphicFactory;
