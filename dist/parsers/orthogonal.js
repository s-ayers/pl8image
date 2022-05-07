"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var binary_parser_1 = require("binary-parser");
exports.Orthogonal = new binary_parser_1.Parser()
    .useContextVars()
    .endianess("little");
