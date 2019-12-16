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
var createBitmapBuffer = require("@s-ayers/bitmap").createBitmapBuffer;
var PNG = require("pngjs").PNG;
var Graphic = /** @class */ (function () {
    function Graphic(width, height, raw, palette) {
        this.width = width;
        this.height = height;
        this.raw = raw;
        this.palette = palette;
    }
    Graphic.prototype.toBMP = function () {
        return createBitmapBuffer({
            bitsPerPixel: 8,
            colorTable: this.palette,
            height: this.height * -1,
            imageData: this.raw,
            width: this.width,
        });
    };
    Graphic.prototype.toPNG = function () {
        var options = { width: this.width, height: this.height };
        var newfile = new PNG(options);
        var bufs = [];
        var buf;
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x);
                var col = this.raw.readUInt8(idx);
                idx = idx << 2;
                if (col !== 0) {
                    newfile.data[idx] = this.palette.readUInt8(col * 4 + 2);
                    newfile.data[idx + 1] = this.palette.readUInt8(col * 4 + 1);
                    newfile.data[idx + 2] = this.palette.readUInt8(col * 4);
                    newfile.data[idx + 3] = 0xff; // this.palette.readUInt8(col * 4 + 1);this.palette.readUInt8(col * 4 + 3);
                }
                else {
                    newfile.data[idx] = 0;
                    newfile.data[idx + 1] = 0;
                    newfile.data[idx + 2] = 0;
                    newfile.data[idx + 3] = 0;
                }
            }
        }
        newfile.pack().pipe(fs.createWriteStream("./data/out.png"));
        // newfile.readable.on('data', (d:any) => { bufs.push(d); });
        // newfile.readable.on('end', () => {
        //   buf = Buffer.concat(bufs);
        // });
        // newfile.pack();
        // var buffer = PNG.sync.write(newfile.data, options);
        return buf;
    };
    return Graphic;
}());
exports.Graphic = Graphic;
