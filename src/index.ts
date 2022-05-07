export { Palette } from "./model/Palette.model";
export { Image } from "./model/Pl8.model";
export { Pl8 } from "./parsers/pl8";

export const tileSize = function (
  type: number,
  width: number,
  height: number,
  rows: number
) {
  let size;
  switch (type) {
    case 0:
      size = width * height;
      break;

    case 1:
      size = height * height;
      break;
    case 2:
      size = height * height + rows * width;
      break;
    case 3:
    case 4:
      size = height * height + rows * (width / 2 + 1);
      break;
  }

  return size;
};

export { GraphicFactory } from "./graphic-factory";
