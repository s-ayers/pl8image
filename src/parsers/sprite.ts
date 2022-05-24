import { Parser } from "binary-parser";

export const Sprite = Parser.start()
  .endianess("little")
  .uint16("width")
  .uint16("height")
  .uint32("offset")
  .uint16("x")
  .uint16("y")
  .uint8("extraType")
  .uint8("extraRows")
  .uint16("unknown_000")
  .saveOffset("currentOffset")
  .seek(4)
  .uint32("offsetEnd")
  .seek(-8)
  .seek(function () {
    return this.offset - this.currentOffset;
  })
  .buffer("raw", {
    length: function () {
      const length = this.height * this.width;

      return length;
    },
  })
  .seek(function () {
    return this.currentOffset - this.offset - (this.height * this.width);
  })
  ;
