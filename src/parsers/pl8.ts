import { Parser } from "binary-parser";
import { Sprite } from "./sprite";

export const Pl8 = new Parser()
  .useContextVars()
  .endianess("little")
  .uint16("type")
  .uint16("numberOfTile")
  .uint32("unknown_000")
  .array("tiles", { type: Sprite, length: "numberOfTile" });
