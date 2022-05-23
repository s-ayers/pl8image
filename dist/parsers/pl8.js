"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pl8 = void 0;
var binary_parser_1 = require("binary-parser");
var sprite_1 = require("./sprite");
exports.Pl8 = new binary_parser_1.Parser()
    .useContextVars()
    .endianess("little")
    .uint16("type")
    .uint16("numberOfTile")
    .uint32("unknown_000")
    .array("tiles", { type: sprite_1.Sprite, length: "numberOfTile" });
