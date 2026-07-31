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
            if (typeof tile.raw === "undefined" || tile.raw.length === 0) {
                var size = GraphicFactory.tileSize(tile.extraType, tile.width, tile.height, tile.extraRows);
                tile.raw = buf.slice(tile.offset, tile.offset + size);
            }
            var localWidth = tile.x + tile.width;
            if (localWidth > width) {
                width = localWidth;
            }
            var localHeight = tile.y + tile.height + tile.extraRows;
            if (localHeight > height) {
                height = localHeight;
            }
        });
        var imageData = Buffer.alloc(height * width, 0x00);
        tiles.forEach(function (tile) {
            GraphicFactory.blitTile(tile, imageData, width);
        });
        var graphic = new Graphic_model_1.Graphic(width, height, imageData, palette);
        return graphic;
    };
    GraphicFactory.Pl8 = function (pl8, palette, buf) {
        switch (pl8.type) {
            case 0:
                return GraphicFactory.orthogonalImage(pl8, palette, buf);
            case 1:
                return GraphicFactory.rleImage(pl8, palette, buf);
            case 2:
            default:
                return GraphicFactory.tiles(pl8.tiles, palette, buf || Buffer.alloc(0), pl8.width, pl8.height);
        }
    };
    GraphicFactory.orthogonalImage = function (pl8, palette, buf) {
        return GraphicFactory.tiles(pl8.tiles, palette, buf || Buffer.alloc(0), pl8.width, pl8.height);
    };
    /**
     * End offset of an RLE tile payload: next tile's offset, or EOF.
     * Stream length is not in the header; game files pack tiles back-to-back.
     */
    GraphicFactory.rlePayloadEnd = function (tiles, index, bufLength) {
        return index + 1 < tiles.length ? tiles[index + 1].offset : bufLength;
    };
    GraphicFactory.rleImage = function (pl8, palette, buf) {
        var width = pl8.width;
        var height = pl8.height;
        pl8.tiles.forEach(function (tile, index) {
            if (typeof tile.raw === "undefined" || tile.raw.length === 0) {
                if (buf) {
                    var end = GraphicFactory.rlePayloadEnd(pl8.tiles, index, buf.length);
                    tile.raw = buf.slice(tile.offset, end);
                }
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
        pl8.tiles.forEach(function (tile) {
            GraphicFactory.runLengthEncoded(tile, imageData, width);
        });
        return new Graphic_model_1.Graphic(width, height, imageData, palette);
    };
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
    GraphicFactory.blitTile = function (tile, buf, width) {
        switch (tile.extraType) {
            case 0:
                GraphicFactory.orthogonal(tile, buf, width);
                break;
            case 1:
                GraphicFactory.isometric(tile, buf, width);
                break;
            case 2:
            case 3:
            case 4:
                GraphicFactory.isometricWithExtras(tile, buf, width);
                break;
        }
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
                    return;
                }
                var target = width * (y + h) + (x + w);
                buf.writeUInt8(data.readUInt8(source), target);
            }
        }
    };
    /**
     * Diamond-only ISO (extraType 1). Sequential packed rows; no magic offsets.
     */
    GraphicFactory.isometric = function (tile, buf, width) {
        GraphicFactory.decodeIsometric(tile, buf, width, false);
    };
    /**
     * ISO with extras (extraType 2 both, 3 left, 4 right) per docs/.pl8.rst.
     */
    GraphicFactory.isometricWithExtras = function (tile, buf, width) {
        GraphicFactory.decodeIsometric(tile, buf, width, true);
    };
    /**
     * Unpack one isometric tile onto the canvas.
     * Matches the C++ sample in docs/.pl8.rst: top half, bottom half, then
     * optional diagonal extra rows. Diamond rows are placed at y + extraRows.
     */
    GraphicFactory.decodeIsometric = function (tile, buf, canvasWidth, withExtras) {
        var data = tile.raw;
        if (!data || data.length === 0) {
            return;
        }
        var tileHeight = tile.height;
        var tileWidth = tile.width;
        var halfHeight = tileHeight / 2;
        var halfWidth = tileWidth / 2;
        var extraRows = tile.extraRows;
        var originX = tile.x;
        var originY = tile.y;
        var source = 0;
        var writePixel = function (localX, localY, value) {
            var target = canvasWidth * (originY + localY) + (originX + localX);
            if (target >= 0 && target < buf.length) {
                buf.writeUInt8(value, target);
            }
        };
        // Fill top half
        for (var y = 0; y < halfHeight; y += 1) {
            var rowStart = (halfHeight - 1 - y) * 2;
            var rowStop = rowStart + y * 4 + 2;
            for (var x = rowStart; x < rowStop; x += 1) {
                if (source >= data.length) {
                    return;
                }
                writePixel(x, y + extraRows, data.readUInt8(source++));
            }
        }
        // Fill bottom half (continues sequential cursor)
        for (var y = halfHeight; y < tileHeight; y += 1) {
            var rowStart = (halfHeight - 1 - (tileHeight - y - 1)) * 2;
            var rowStop = rowStart + (tileHeight - y - 1) * 4 + 2;
            for (var x = rowStart; x < rowStop; x += 1) {
                if (source >= data.length) {
                    return;
                }
                writePixel(x, y + extraRows, data.readUInt8(source++));
            }
        }
        if (!withExtras || extraRows <= 0) {
            return;
        }
        // Fill extra rows (diagonal) — docs/.pl8.rst
        for (var y_ = extraRows; y_ > 0; y_ -= 1) {
            var rightOffset = tile.extraType === 3 ? halfWidth + 1 : tileWidth;
            var leftOffset = tile.extraType === 4 ? halfWidth - 1 : 0;
            for (var x = leftOffset; x < rightOffset; x += 1) {
                if (source >= data.length) {
                    return;
                }
                var y = x <= halfWidth
                    ? y_ + (halfHeight - 1) - Math.floor(x / 2)
                    : y_ + Math.floor(x / 2) - (halfHeight - 1);
                writePixel(x, y, data.readUInt8(source++));
            }
        }
    };
    GraphicFactory.runLengthEncoded = function (tile, buf, width) {
        var tileWidth = tile.width;
        var tileHeight = tile.height;
        var x = tile.x;
        var y = tile.y;
        var data = tile.raw;
        var z = 0;
        for (var h = 0; h < tileHeight; h += 1) {
            var w = 0;
            while (w < tileWidth) {
                if (z >= data.length) {
                    return;
                }
                var opaquePixels = data.readUInt8(z++);
                if (opaquePixels === 0) {
                    if (z >= data.length) {
                        return;
                    }
                    var transparentPixels = data.readUInt8(z++);
                    w += transparentPixels;
                }
                else {
                    for (var i = 0; i < opaquePixels; i += 1) {
                        if (z >= data.length) {
                            return;
                        }
                        var value = data.readUInt8(z++);
                        var target = width * (y + h) + (x + w);
                        buf.writeUInt8(value, target);
                        w += 1;
                    }
                }
            }
        }
    };
    return GraphicFactory;
}());
exports.GraphicFactory = GraphicFactory;
