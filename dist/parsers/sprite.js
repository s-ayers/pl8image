"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var binary_parser_1 = require("binary-parser");
exports.Sprite = binary_parser_1.Parser.start()
    .useContextVars()
    .endianess("little")
    .uint16("width")
    .uint16("height")
    .uint32("offset")
    .uint16("x")
    .uint16("y")
    .uint8("extraType")
    .uint8("extraRows")
    .uint16("unknown_000");
