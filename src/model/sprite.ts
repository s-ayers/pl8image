import { Image } from "./image";

export class Sprite extends Image {
  constructor(
    public height: number,
    public width: number,
    public x: number,
    public y: number,
    protected buffer: Buffer
  ) {
    super();
  }
}
