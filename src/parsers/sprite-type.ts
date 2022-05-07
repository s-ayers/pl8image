import { Parser } from "binary-parser";

export const SpriteType = Parser.start()
.useContextVars()
.endianess("little");
