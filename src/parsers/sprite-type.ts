import { Parser } from 'binary-parser';
import { Orthogonal } from './orthogonal';

export const SpriteType = Parser.start()
.useContextVars()
.endianess("little")
