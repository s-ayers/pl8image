import { title } from "process";
import { Graphic } from "./model/Graphic.model";
import { Tile } from "./model/Tile.model";

export class GraphicFactory {
  public static tiles(
    tiles: Tile[],
    buf: Buffer,
    palette: Buffer,
    width = 0,
    height = 0
  ) {
    tiles.forEach((tile) => {
      var size = GraphicFactory.tileSize(
        tile.extraType,
        tile.width,
        tile.height,
        tile.extraRows
      );
      tile.raw = buf.slice(tile.offset, tile.offset + size);

      let localWidth = tile.x + tile.width;
      if (localWidth > width) width = localWidth;

      let localHeight = tile.y + tile.height;
      if (localHeight > height) height = localHeight;
    });

    const imageData = Buffer.alloc(height * width, 0x00);
    tiles.forEach((tile) => {
      switch (tile.extraType) {
        case 0:
          GraphicFactory.orthogonal(tile, imageData, width);
          break;
        case 1:
          GraphicFactory.isometric(tile, imageData, width);
          break;
        case 2:
          GraphicFactory.isometricExtra(tile, imageData, width);
          break;
        case 3:
          GraphicFactory.isometricLeft(tile, imageData, width);
          break;
        case 4:
          GraphicFactory.isometricRight(tile, imageData, width);
          break;
      }
    });
    const graphic = new Graphic(width, height, imageData, palette);
    return graphic;
  }

  public static tile(tile: Tile, buf: Buffer) {}

  protected static tileSize(
    type: number,
    width: number,
    height: number,
    rows: number
  ): number {
    let size;
    switch (type) {
      case 0:
        size = width * height;
        break;

      case 2:
        size = height * height + rows * width;
        break;
      case 3:
      case 4:
        size = height * height + rows * (width / 2 + 1);
        break;
      case 1:
      default:
        size = height * height;
        break;
    }

    return size;
  }
  protected static orthogonal(tile: Tile, buf: Buffer, width: number) {
    const tileWidth = tile.width;
    const tileHeight = tile.height;
    const x = tile.x;
    const y = tile.y;
    const data = tile.raw;

    for (let h = 0; h < tileHeight; h++) {
      for (let w = 0; w < tileWidth - 1; w++) {
        const source = h * tileWidth + w;
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(data.readUInt8(source), target);
      }
    }
  }

  protected static isometric(tile: Tile, buf: Buffer, width: number) {
    const tileWidth = tile.width;
    const tileHeight = tile.height;
    const x = tile.x;
    const y = tile.y;
    const data = tile.raw;
    const halfHeight = tileHeight / 2;

    // Fill top half
    let source = 0;
    for (let h = 0; h < halfHeight; h += 1) {
      let rowStart = (halfHeight - 1 - h) * 2;
      let rowStop = rowStart + h * 4 + 2;
      for (let w = rowStart; w < rowStop; w++) {
        let value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }

    // fill bottom
    for (let h = halfHeight; h < tileHeight; h += 1) {
      let rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
      let rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;

      for (let w = rowStart; w < rowStop; w++) {
        let value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }
  }

  protected static isometricExtra(tile: Tile, buf: Buffer, width: number) {
    const tileWidth = tile.width;
    const tileHeight = tile.height;
    const x = tile.x;
    const y = tile.y;
    const data = tile.raw;
    const halfHeight = tileHeight / 2;

    // Fill top half
    let source = 0;
    for (let h = 0; h < halfHeight; h += 1) {
      let rowStart = (halfHeight - 1 - h) * 2;
      let rowStop = rowStart + h * 4 + 2;
      for (let w = rowStart; w < rowStop; w++) {
        let value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
        // console.log({target, w, h});
      }
      console.log("");
    }

    // fill bottom
    for (let h = halfHeight; h < tileHeight; h += 1) {
      let rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
      let rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;

      for (let w = rowStart; w < rowStop; w++) {
        let value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }


    if ( data.length  > source) {
        for(let extra = 0; extra < tile.extraRows; extra += 1) {
            let value = data.readUInt8(source++);
            let target = width * (y + halfHeight - 1) + (x - 2);
            console.log("");
            console.log({ target, source, length: data.length });
            // buf.writeUInt8(value, target);
        }

    }


    // fill extra
    // while (source < data.length) {
    //   console.log({source, data: data.length });
    //   source += 1;

    // }
  }

  protected static isometricLeft(tile: Tile, buf: Buffer, width: number) {
    const tileWidth = tile.width;
    const tileHeight = tile.height;
    const x = tile.x;
    const y = tile.y;
    const data = tile.raw;
    const halfHeight = tileHeight / 2;

    // Fill top half
    let source = 0;
    for (let h = 0; h < halfHeight; h += 1) {
      let rowStart = (halfHeight - 1 - h) * 2;
      let rowStop = rowStart + h * 4 + 2;
      for (let w = rowStart; w < rowStop; w++) {
        let value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }

    // fill bottom
    for (let h = halfHeight; h < tileHeight; h += 1) {
      let rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
      let rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;

      for (let w = rowStart; w < rowStop; w++) {
        let value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }
  }

  protected static isometricRight(tile: Tile, buf: Buffer, width: number) {
    const tileWidth = tile.width;
    const tileHeight = tile.height;
    const x = tile.x;
    const y = tile.y;
    const data = tile.raw;
    const halfHeight = tileHeight / 2;

    // Fill top half
    let source = 0;
    for (let h = 0; h < halfHeight; h += 1) {
      let rowStart = (halfHeight - 1 - h) * 2;
      let rowStop = rowStart + h * 4 + 2;
      for (let w = rowStart; w < rowStop; w++) {
        let value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }

    // fill bottom
    for (let h = halfHeight; h < tileHeight; h += 1) {
      let rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
      let rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;

      for (let w = rowStart; w < rowStop; w++) {
        let value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }
  }
}