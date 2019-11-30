"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Pl8_model_1 = require("./model/Pl8.model");
var fs = __importStar(require("fs"));
var _a = require('bitmap-js'), padImageData = _a.padImageData, createBitmapFile = _a.createBitmapFile;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var colorTable, pp8, tile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                colorTable = fs.readFileSync('./data/BASE01.256');
                return [4 /*yield*/, Pl8_model_1.Image.file('./data/VILLAGE.PL8')];
            case 1:
                pp8 = _a.sent();
                tile = pp8.tiles.tiles[0];
                console.log(tile);
                return [2 /*return*/];
        }
    });
}); })();
// (async () => {
//     let myPal = await Palette.file('./data/BASE01.256'),
//         myImage = await Image.file('./data/VILLAGE.PL8');
//         console.log(myImage);
// })()
// Palette.file('./data/BASE01.256').then( pal => {
//     Image.file('./data/VILLAGE.PL8').then(value => {
//         // console.log(value.tiles.tiles[0].Orthogonal(pal));
// const myTile = value.tiles.tiles[0];
//         const myImage = new PNG({
//             height: myTile.height,
//             width: myTile.width,
//             inputHasAlpha: true,
//             bitDepth: 8
//         });
//         myImage.data = myTile.Orthogonal(pal);
//  console.log(myImage.data);       
// // console.log(myTile.Orthogonal(pal).length);
//  var buffer = PNG.sync.write(myImage);
// //  console.log(buffer);
// fs.writeFileSync('./data/out.png', buffer);
//         // .parse(myTile.Orthogonal(pal), (error, data) => {
//         //     console.log(error);
//         //     console.log(data);
//         //     fs.writeFile('./data/out.png', data, () => {
//         //         console.log('done');
//         //     });
//         // });
//     });
//     Image.file('/media/steve/Windows/Users/alche/Documents/Lords of the Realm II/pl82png/PL8/Trp_xb_y.pl8').then(value => {
//         console.log(value.tiles.tiles[1]);
//     });
// });
// const ddata = fs.readFileSync('./data/VILLAGE.BMP.BASE01.256.PNG');
// console.log(ddata);
