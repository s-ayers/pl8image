import * as fs from "fs";
import { GraphicFactory } from "./graphic-factory";
import { Palette } from "./model/Palette.model";
import { Image } from "./model/Pl8.model";

(async () => {
  const pal = await Palette.file("./data/BASE01.256");
  const raw = fs.readFileSync("./data/Village.pl8");
  const pp8 = Image.buffer(raw);
  const graphic = GraphicFactory.Pl8(pp8, pal, raw);

  fs.writeFile("./data/out.png", await graphic.toPNG(), (err) => {
    if (err) {
      throw err;
    }
  });
  fs.writeFile("./data/out.bmp", await graphic.toBMP(), (err) => {
    if (err) {
      throw err;
    }
  });
})();
