import { Graphic } from "./model/Graphic.model";
import { Image } from "./model/Pl8.model";
import { Tile } from "./model/Tile.model";

export class GraphicFactory {
  public static tiles(
    tiles: Tile[],
    palette: Buffer,
    buf: Buffer,
    width = 0,
    height = 0,
  ) {
    tiles.forEach((tile) => {
      if (typeof tile.raw === "undefined" || tile.raw.length === 0) {
        const size = GraphicFactory.tileSize(
          tile.extraType,
          tile.width,
          tile.height,
          tile.extraRows,
        );
        tile.raw = buf.slice(tile.offset, tile.offset + size);
      }

      const localWidth = tile.x + tile.width;
      if (localWidth > width) {
        width = localWidth;
      }

      const localHeight = tile.y + tile.height + tile.extraRows;
      if (localHeight > height) {
        height = localHeight;
      }
    });

    const imageData = Buffer.alloc(height * width, 0x00);
    tiles.forEach((tile) => {
      GraphicFactory.blitTile(tile, imageData, width);
    });
    const graphic = new Graphic(width, height, imageData, palette);

    return graphic;
  }

  public static Pl8(pl8: Image.Pl8Image, palette: Buffer, buf?: Buffer) {
    switch (pl8.type) {
      case 0:
        return GraphicFactory.orthogonalImage(pl8, palette, buf);
      case 1:
        return GraphicFactory.rleImage(pl8, palette, buf);
      case 2:
      default:
        return GraphicFactory.tiles(
          pl8.tiles,
          palette,
          buf || Buffer.alloc(0),
          pl8.width,
          pl8.height,
        );
    }
  }

  protected static orthogonalImage(
    pl8: Image.Pl8Image,
    palette: Buffer,
    buf?: Buffer,
  ) {
    return GraphicFactory.tiles(
      pl8.tiles,
      palette,
      buf || Buffer.alloc(0),
      pl8.width,
      pl8.height,
    );
  }

  /**
   * End offset of an RLE tile payload: next tile's offset, or EOF.
   * Stream length is not in the header; game files pack tiles back-to-back.
   */
  public static rlePayloadEnd(
    tiles: Tile[],
    index: number,
    bufLength: number,
  ): number {
    return index + 1 < tiles.length ? tiles[index + 1].offset : bufLength;
  }

  protected static rleImage(
    pl8: Image.Pl8Image,
    palette: Buffer,
    buf?: Buffer,
  ) {
    let width = pl8.width;
    let height = pl8.height;

    pl8.tiles.forEach((tile, index) => {
      if (typeof tile.raw === "undefined" || tile.raw.length === 0) {
        if (buf) {
          const end = GraphicFactory.rlePayloadEnd(
            pl8.tiles,
            index,
            buf.length,
          );
          tile.raw = buf.slice(tile.offset, end);
        }
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
    pl8.tiles.forEach((tile) => {
      GraphicFactory.runLengthEncoded(tile, imageData, width);
    });

    return new Graphic(width, height, imageData, palette);
  }

  public static tileSize(
    type: number,
    width: number,
    height: number,
    rows: number,
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

  protected static blitTile(tile: Tile, buf: Buffer, width: number) {
    switch (tile.extraType) {
      case 0:
        GraphicFactory.orthogonal(tile, buf, width);
        break;
      case 1:
        GraphicFactory.isometric(tile, buf, width);
        break;
      case 2:
      case 3:
      case 4:
        GraphicFactory.isometricWithExtras(tile, buf, width);
        break;
    }
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
          return;
        }

        const target = width * (y + h) + (x + w);

        buf.writeUInt8(data.readUInt8(source), target);
      }
    }
  }

  /**
   * Diamond-only ISO (extraType 1). Sequential packed rows; no magic offsets.
   */
  protected static isometric(tile: Tile, buf: Buffer, width: number) {
    GraphicFactory.decodeIsometric(tile, buf, width, false);
  }

  /**
   * ISO with extras (extraType 2 both, 3 left, 4 right) per docs/.pl8.rst.
   */
  protected static isometricWithExtras(
    tile: Tile,
    buf: Buffer,
    width: number,
  ) {
    GraphicFactory.decodeIsometric(tile, buf, width, true);
  }

  /**
   * Unpack one isometric tile onto the canvas.
   * Matches the C++ sample in docs/.pl8.rst: top half, bottom half, then
   * optional diagonal extra rows. Diamond rows are placed at y + extraRows.
   */
  protected static decodeIsometric(
    tile: Tile,
    buf: Buffer,
    canvasWidth: number,
    withExtras: boolean,
  ) {
    const data = tile.raw;
    if (!data || data.length === 0) {
      return;
    }

    const tileHeight = tile.height;
    const tileWidth = tile.width;
    const halfHeight = tileHeight / 2;
    const halfWidth = tileWidth / 2;
    const extraRows = tile.extraRows;
    const originX = tile.x;
    const originY = tile.y;
    let source = 0;

    const writePixel = (localX: number, localY: number, value: number) => {
      const target = canvasWidth * (originY + localY) + (originX + localX);
      if (target >= 0 && target < buf.length) {
        buf.writeUInt8(value, target);
      }
    };

    // Fill top half
    for (let y = 0; y < halfHeight; y += 1) {
      const rowStart = (halfHeight - 1 - y) * 2;
      const rowStop = rowStart + y * 4 + 2;
      for (let x = rowStart; x < rowStop; x += 1) {
        if (source >= data.length) {
          return;
        }
        writePixel(x, y + extraRows, data.readUInt8(source++));
      }
    }

    // Fill bottom half (continues sequential cursor)
    for (let y = halfHeight; y < tileHeight; y += 1) {
      const rowStart = (halfHeight - 1 - (tileHeight - y - 1)) * 2;
      const rowStop = rowStart + (tileHeight - y - 1) * 4 + 2;
      for (let x = rowStart; x < rowStop; x += 1) {
        if (source >= data.length) {
          return;
        }
        writePixel(x, y + extraRows, data.readUInt8(source++));
      }
    }

    if (!withExtras || extraRows <= 0) {
      return;
    }

    // Fill extra rows (diagonal) — docs/.pl8.rst
    for (let y_ = extraRows; y_ > 0; y_ -= 1) {
      const rightOffset =
        tile.extraType === 3 ? halfWidth + 1 : tileWidth;
      const leftOffset = tile.extraType === 4 ? halfWidth - 1 : 0;

      for (let x = leftOffset; x < rightOffset; x += 1) {
        if (source >= data.length) {
          return;
        }
        const y =
          x <= halfWidth
            ? y_ + (halfHeight - 1) - Math.floor(x / 2)
            : y_ + Math.floor(x / 2) - (halfHeight - 1);
        writePixel(x, y, data.readUInt8(source++));
      }
    }
  }

  protected static runLengthEncoded(tile: Tile, buf: Buffer, width: number) {
    const tileWidth = tile.width;
    const tileHeight = tile.height;
    const x = tile.x;
    const y = tile.y;
    const data = tile.raw;
    let z = 0;

    for (let h = 0; h < tileHeight; h += 1) {
      let w = 0;
      while (w < tileWidth) {
        if (z >= data.length) {
          return;
        }
        const opaquePixels = data.readUInt8(z++);
        if (opaquePixels === 0) {
          if (z >= data.length) {
            return;
          }
          const transparentPixels = data.readUInt8(z++);
          w += transparentPixels;
        } else {
          for (let i = 0; i < opaquePixels; i += 1) {
            if (z >= data.length) {
              return;
            }
            const value = data.readUInt8(z++);
            const target = width * (y + h) + (x + w);
            buf.writeUInt8(value, target);

            w += 1;
          }
        }
      }
    }
  }
}
