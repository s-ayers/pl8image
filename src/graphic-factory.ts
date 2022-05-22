import { Graphic } from "./model/Graphic.model";
import { Tile } from "./model/Tile.model";

export class GraphicFactory {
  public static tiles(
    tiles: Tile[],
    palette: Buffer,
    buf: Buffer,
    width = 0,
    height = 0
  ) {
    tiles.forEach((tile) => {
      if (typeof tile.raw === "undefined") {
        const size = GraphicFactory.tileSize(
          tile.extraType,
          tile.width,
          tile.height,
          tile.extraRows
        );
        tile.raw = buf.slice(tile.offset, tile.offset + size);
      }

      const localWidth = tile.x + tile.width;
      if (localWidth > width) {
        width = localWidth;
      }

      const localHeight = tile.y + tile.height;
      if (localHeight > height) {
        height = localHeight;
      }
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

  //   public static tile(tile: Tile, buf: Buffer) {}

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

        if (source >= data.length) {
          console.log("source is large than buffer - orthogonal");
          break;
        }

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
      const rowStart = (halfHeight - 1 - h) * 2;
      const rowStop = rowStart + h * 4 + 2;
      for (let w = rowStart; w < rowStop; w++) {
        if (source >= data.length) {
          console.log("source is large than buffer - isometric - top");
          break;
        }
        const value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }

    // fill bottom
    for (let h = halfHeight; h < tileHeight; h += 1) {
      const rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
      const rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;

      for (let w = rowStart; w < rowStop; w++) {
        const value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }
  }

  protected static isometricExtra(tile: Tile, buf: Buffer, width: number) {
    const rightBound = tile.x + tile.width;
    const tileHeight = tile.height;
    const x = tile.x;
    const y = tile.y;
    const data = tile.raw;
    const halfHeight = tileHeight / 2;
    const halfWidth = tile.width / 2;

    // Fill top half
    let source = 0;
    for (let h = 0; h < halfHeight; h += 1) {
      const rowStart = (halfHeight - 1 - h) * 2;
      const rowStop = rowStart + h * 4 + 2;
      for (let w = rowStart; w < rowStop; w++) {
        const value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);
        buf.writeUInt8(value, target);
      }
    }

    // fill bottom
    for (let h = halfHeight; h < tileHeight; h += 1) {
      const rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
      const rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;

      for (let w = rowStart; w < rowStop; w += 1) {
        const value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }

    // Fill Extra
    if (data.length > source) {

      for (let i = 0, h = halfHeight - 1; i < tile.extraRows; i += 1) {
        const rowStart = (halfHeight - 1 - h) * 2;
        const rowStop = rowStart + h * 4 + 2;

        for (let w = 0; w < tile.width; w += 1) {
          if (source >= data.length) {
            console.log("source is large than buffer - isometricextra - extra");
            console.log({w, h, x, y});
            console.log(tile);
            break;
            break;
          }
          const value = data.readUInt8(source++);
          const target = width * (y + h) + (x + w);

          if (w % 2 === 1) {
            if (w < halfWidth) {
              h -= 1;
            } else {
              h += 1;
            }
          }
          buf.writeUInt8(value, target);
        }
        h = halfHeight - i - 1;
      }
    }
  }

  protected static isometricLeft(tile: Tile, buf: Buffer, width: number) {
    const tileWidth = tile.width;
    const tileHeight = tile.height;
    const x = tile.x;
    const y = tile.y;
    const data = tile.raw;
    const halfHeight = tileHeight / 2;
    const halfWidth = tile.width / 2;

    // Fill top half
    let source = 0;
    for (let h = 0; h < halfHeight; h += 1) {
      const rowStart = (halfHeight - 1 - h) * 2;
      const rowStop = rowStart + h * 4 + 2;
      for (let w = rowStart; w < rowStop; w++) {
        const value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }

    // fill bottom
    for (let h = halfHeight; h < tileHeight; h += 1) {
      const rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
      const rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;

      for (let w = rowStart; w < rowStop; w++) {
        const value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }

    // Fill Extra
    if (data.length > source) {
      for (let i = 2, h = halfHeight - i; i < tile.extraRows; i += 1) {
        const rowStart = (halfHeight - 1 - h) * 2;
        const rowStop = rowStart + h * 4 + 2;

        for (let w = 0; w < halfWidth + 1; w += 1) {
          if (source >= data.length) {
            console.log("source is large than buffer - isometricleft - extra");
            break;
          }
          const value = data.readUInt8(source++);
          const target = width * (y + h) + (x + w);

          if (w % 2 === 1) {
            h -= 1;
          }
          buf.writeUInt8(value, target);
        }
        h = halfHeight - i;
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
    const halfWidth = tile.width / 2;

    // Fill top half
    let source = 0;
    for (let h = 0; h < halfHeight; h += 1) {
      const rowStart = (halfHeight - 1 - h) * 2;
      const rowStop = rowStart + h * 4 + 2;
      for (let w = rowStart; w < rowStop; w++) {
        const value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }

    // fill bottom
    for (let h = halfHeight; h < tileHeight; h += 1) {
      const rowStart = (halfHeight - 1 - (tileHeight - h - 1)) * 2;
      const rowStop = rowStart + (tileHeight - h - 1) * 4 + 2;

      for (let w = rowStart; w < rowStop; w++) {
        const value = data.readUInt8(source++);
        const target = width * (y + h) + (x + w);

        buf.writeUInt8(value, target);
      }
    }

    // Fill Extra
    if (data.length > source) {
      for (let i = 1, h = 0- i; i < tile.extraRows; i += 1) {
        const rowStart = (halfHeight - 1 - h) * 2;
        const rowStop = rowStart + h * 4 + 2;

        for (let w = halfWidth - 1; w <  tile.width ; w += 1) {
          const value = data.readUInt8(source++);
          const target = width * (y + h) + (x + w);

          if (w % 2 === 1) {
            h += 1;
          }
          buf.writeUInt8(value, target);
        }
        h = 0 - i;
      }
    }
  }
}
