
import * as fs from "fs";
import {Palette} from "./model/Palette.model";
import { Image } from "./model/Pl8.model";

(async () => {

    const pal = await Palette.file("./data/BASE01.256");

    const pp8 =  await Image.file("./data/Village.pl8");

    pp8.Orthogonal(pal).toPNG();
    fs.writeFile("./data/out.bmp", pp8.Orthogonal(pal).toBMP(), (err) => {
      if (err) { throw err; }
    });

})();
