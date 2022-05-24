import { Parser } from "binary-parser";
import { Sprite } from "./Sprite";

export const Pl8 = new Parser()
  .useContextVars()
  .endianess("little")
  .uint16("type")
  .uint16("numberOfTile")
  .uint32("unknown_000")

  .array("sprites", {
    type: Sprite,
    length: "numberOfTile",
  });
