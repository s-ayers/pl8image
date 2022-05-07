import { Parser } from "binary-parser";
import { SpriteType } from "./sprite-type";

export const Sprite = Parser.start()
  .useContextVars()
  .endianess("little")
  .uint16("width")
  .uint16("height")
  .uint32("offset")
  .uint16("x")
  .uint16("y")
  .uint8("extraType")
  .uint8("extraRows")
  .uint16("unknown_000")
  // .pointer("raw", {
  //   offset: "offset",
  //   type: SpriteType,
  // })
  ;
