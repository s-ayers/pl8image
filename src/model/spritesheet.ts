import { Sprite } from "./sprite";
import { Image } from "./image";

export class SpriteSheet extends Image {
  public Sprites: Sprite[] = [];
  protected pl8: any;

  constructor(pl8: any, force: number = null) {
    super();
    console.log(force);
    this.width = 640;
    this.height = 480;

    this.pl8 = pl8;
    const type = force !== null ? force : pl8.type;
    switch (type) {
      case 0:
        this.orthogonal();
        break;

      case 1:
        this.rle();
        break;

      case 2:
        this.isometric();
        break;
    }
  }

  private orthogonal() {
    this.pl8.sprites.forEach((sprite) => {
      const s = new Sprite(
        sprite.height,
        sprite.width,
        sprite.x,
        sprite.y,
        sprite.raw
      );
      this.Sprites.push(s);
    });
  }

  private isometric() {
    this.pl8.sprites.forEach((sprite) => {
      const width = sprite.width;
      const height = sprite.height;
      const halfHeight = height / 2;
      const size = (height + sprite.extraRows) * width;
      const data = Buffer.alloc(size, 0x00);

      // Fill top half
      let source = 0;
      for (let y = 0; y < halfHeight; y += 1) {
        const rowStart = (halfHeight - 1 - y) * 2;
        const rowStop = rowStart + y * 4 + 2;

        for (let x = rowStart; x < rowStop; x += 1) {
          const value = sprite.raw.readUInt8(source);
          source += 1;
          const target = width * y + x;

          data.writeUInt8(value, target);
        }
      }

      // fill bottom
      for (let h = halfHeight; h < sprite.height; h += 1) {
        const rowStart = (halfHeight - 1 - (sprite.height - h - 1)) * 2;
        const rowStop = rowStart + (sprite.height - h - 1) * 4 + 2;

        for (let w = rowStart; w < rowStop; w += 1) {
          const value = sprite.raw.readUInt8(source);
          source += 1;
          const target = width * h + w;

          data.writeUInt8(value, target);
        }
      }

      const halfWidth = sprite.width / 2;
      const no_extra = 1;
      const full_extra = 2;
      const left_Extra = 3;
      const right_extra = 4;

      if (sprite.extraType !== no_extra) {
        let leftOffset = 0;
        let rightOffset = width;
        let initialHeight = halfHeight;
        let extraWidth = width;

        if (sprite.extraType == left_Extra) {
          rightOffset = width / 2 + 1;
          extraWidth = rightOffset + 1;
        } else if (sprite.extraType == right_extra) {
          leftOffset = width / 2 - 1;
          initialHeight = height + 1;
          extraWidth = leftOffset - 1;
        }
        //   console.log(sprite.extraRows);
        //   console.log({leftOffset, rightOffset});
        //       // Fill Extra
        for (let h = 0, y = initialHeight; h < sprite.extraRows; h += 1) {
          //         const rowStart = (halfHeight - 1 - h) * 2;
          //         const rowStop = rowStart + h * 4 + 2;
          for (let x = leftOffset; x < rightOffset; x += 1) {
            if (source >= sprite.raw.length) {
              console.log(
                "source is large than buffer - isometricextra - extra"
              );
              console.log({
                x,
                y,
                leftOffset,
                rightOffset,
                source,
                length: sprite.raw.length,
                initialHeight,
              });
              break;
            }
            const value = sprite.raw.readUInt8(source);
            source += 1;
            const target = width * y + x;
            // console.log({ width, h, x, target });

            if (x % 2 === 1) {
              if (x < halfWidth) {
                y -= 1;
              } else {
                y += 1;
              }
            }
            //   data.writeUInt8(value, target);
          }
          y = initialHeight + h + 1;
        }
      }

      const s = new Sprite(height, width, sprite.x, sprite.y, data);
      this.Sprites.push(s);
    });
  }

  private rle() {
    this.pl8.sprites.forEach((sprite) => {
      const width = sprite.width;
      const height = sprite.height;

      const data = Buffer.alloc(height * width, 0x00);

      let z = 0;
      for (let y = 0; y < height; y += 1) {
        let x = 0;
        while (x < width) {
          const opaquePixels = sprite.raw.readUInt8(z);
          z += 1;
          if (opaquePixels === 0) {
            const transparentPixels = sprite.raw.readUInt8(z);
            z += 1;
            x += transparentPixels;
          } else {
            for (let i = 0; i < opaquePixels; i += 1) {
              const value = sprite.raw.readUInt8(z);
              const target = width * y + x;

              data.writeUInt8(value, target);
              x += 1;
              z += 1;
            }
          }
        }
      }
      const s = new Sprite(height, width, sprite.x, sprite.y, data);
      this.Sprites.push(s);
    });
  }
}
