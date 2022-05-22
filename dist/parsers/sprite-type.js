"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteType = void 0;
var binary_parser_1 = require("binary-parser");
exports.SpriteType = binary_parser_1.Parser.start()
    .useContextVars()
    .endianess("little");
