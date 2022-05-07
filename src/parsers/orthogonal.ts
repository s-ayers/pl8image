import { Parser } from "binary-parser";

export const Orthogonal = new Parser()
.useContextVars()
.endianess("little")
// .array("data", {
//     type: "uint8",
//     length: function() {
//       return this.$parent.height * this.$parent.width;

//   }})
    ;
