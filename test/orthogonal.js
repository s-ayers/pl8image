var assert = require("assert");
var crypto = require("crypto");
var fs = require("fs");
var path = require("path");
var pl8 = require("../dist/index");
var { Tile } = require("../dist/model/Tile.model");

var FIXTURE_PL8 = "data/Caspics.pl8";
var FIXTURE_PAL = "data/Cas_back.256";
var hasFixtures = fs.existsSync(FIXTURE_PL8) && fs.existsSync(FIXTURE_PAL);

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function readGolden(name) {
  return fs
    .readFileSync(path.join("test/golden", name), "utf8")
    .trim();
}

/** Build a type-0 .pl8 buffer from positioned orthogonal tiles. */
function buildOrthoPl8(tiles) {
  var n = tiles.length;
  var headerSize = 8 + n * 16;
  var total = headerSize;
  tiles.forEach(function (t) {
    total += t.width * t.height;
  });
  var buf = Buffer.alloc(total);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(n, 2);
  var offset = headerSize;
  var i;
  for (i = 0; i < n; i += 1) {
    var t = tiles[i];
    var p = 8 + i * 16;
    buf.writeUInt16LE(t.width, p);
    buf.writeUInt16LE(t.height, p + 2);
    buf.writeUInt32LE(offset, p + 4);
    buf.writeUInt16LE(t.x || 0, p + 8);
    buf.writeUInt16LE(t.y || 0, p + 10);
    buf.writeUInt8(0, p + 12);
    buf.writeUInt8(0, p + 13);
    Buffer.from(t.pixels).copy(buf, offset);
    offset += t.width * t.height;
  }
  return buf;
}

function indexAt(graphic, width, x, y) {
  return graphic.raw.readUInt8(width * y + x);
}

describe("Orthogonal Image (synthetic)", function () {
  it("composites multi-tile canvas and copies last column", function () {
    var left = Buffer.alloc(4 * 2, 0);
    left[3] = 7; // last column of row 0
    left[7] = 9; // last column of row 1
    var right = Buffer.alloc(4 * 2, 0);
    right[0] = 3;
    var buf = buildOrthoPl8([
      { width: 4, height: 2, x: 0, y: 0, pixels: left },
      { width: 4, height: 2, x: 4, y: 0, pixels: right },
    ]);
    var image = pl8.Image.buffer(buf);
    image.width = 8;
    image.height = 2;
    var palette = Buffer.alloc(256 * 4, 0);
    var graphic = pl8.GraphicFactory.Pl8(image, palette, buf);

    assert.equal(graphic.width, 8);
    assert.equal(graphic.height, 2);
    assert.equal(indexAt(graphic, 8, 3, 0), 7);
    assert.equal(indexAt(graphic, 8, 3, 1), 9);
    assert.equal(indexAt(graphic, 8, 4, 0), 3);
  });

  it("Tile.Orthogonal exports a single sprite", function () {
    var pixels = Buffer.from([1, 2, 3, 4]);
    var tile = new Tile(2, 2, 0, pixels);
    var palette = Buffer.alloc(256 * 4, 0);
    var graphic = tile.Orthogonal(palette);
    assert.equal(graphic.width, 2);
    assert.equal(graphic.height, 2);
    assert.equal(indexAt(graphic, 2, 1, 0), 2);
  });
});

describe("Orthogonal Image (Caspics)", function () {
  var caspics;
  var palette;

  before(async function () {
    if (!hasFixtures) {
      this.skip();
    }
    caspics = fs.readFileSync(FIXTURE_PL8);
    palette = await pl8.Palette.file(FIXTURE_PAL);
    fs.mkdirSync("data/out", { recursive: true });
  });

  describe("og Parser", function () {
    it("parses Caspics header and tile positions", function () {
      if (!hasFixtures) {
        this.skip();
      }
      var image = pl8.Image.buffer(caspics);

      assert.equal(image.type, 0);
      assert.equal(image.width, 640);
      assert.equal(image.height, 480);
      assert.equal(image.tiles.length, 4);

      assert.equal(image.tiles[0].x, 0);
      assert.equal(image.tiles[0].y, 0);
      assert.equal(image.tiles[0].width, 320);
      assert.equal(image.tiles[0].height, 200);
      assert.equal(image.tiles[0].extraRows, 0);
      assert.equal(image.tiles[0].extraType, 0);

      assert.equal(image.tiles[1].x, 320);
      assert.equal(image.tiles[1].y, 0);
      assert.equal(image.tiles[1].width, 320);
      assert.equal(image.tiles[1].height, 200);

      assert.equal(image.tiles[2].x, 0);
      assert.equal(image.tiles[2].y, 200);
      assert.equal(image.tiles[2].width, 320);
      assert.equal(image.tiles[2].height, 200);

      assert.equal(image.tiles[3].x, 320);
      assert.equal(image.tiles[3].y, 200);
      assert.equal(image.tiles[3].width, 320);
      assert.equal(image.tiles[3].height, 200);
    });
  });

  describe("binary Parser", function () {
    it("parses with binary parser tile geometry", function () {
      if (!hasFixtures) {
        this.skip();
      }
      var image = pl8.Pl8.parse(caspics);

      assert.equal(image.type, 0);
      assert.equal(image.tiles.length, 4);

      assert.equal(image.tiles[0].x, 0);
      assert.equal(image.tiles[0].y, 0);
      assert.equal(image.tiles[0].height, 200);
      assert.equal(image.tiles[0].width, 320);
      assert.equal(image.tiles[0].extraRows, 0);
      assert.equal(image.tiles[0].extraType, 0);

      assert.equal(image.tiles[1].x, 320);
      assert.equal(image.tiles[1].y, 0);
      assert.equal(image.tiles[1].height, 200);
      assert.equal(image.tiles[1].width, 320);
      assert.equal(image.tiles[1].extraRows, 0);
      assert.equal(image.tiles[1].extraType, 0);

      assert.equal(image.tiles[2].x, 0);
      assert.equal(image.tiles[2].y, 200);
      assert.equal(image.tiles[2].height, 200);
      assert.equal(image.tiles[2].width, 320);
      assert.equal(image.tiles[2].extraRows, 0);
      assert.equal(image.tiles[2].extraType, 0);

      assert.equal(image.tiles[3].x, 320);
      assert.equal(image.tiles[3].y, 200);
      assert.equal(image.tiles[3].height, 200);
      assert.equal(image.tiles[3].width, 320);
      assert.equal(image.tiles[3].extraRows, 0);
      assert.equal(image.tiles[3].extraType, 0);
    });
  });

  describe("bmp/png export", function () {
    it("composites 640x480 BMP and matches golden digest", async function () {
      if (!hasFixtures) {
        this.skip();
      }
      var image = pl8.Image.buffer(caspics);
      var graphic = pl8.GraphicFactory.Pl8(image, palette, caspics);
      assert.equal(graphic.width, 640);
      assert.equal(graphic.height, 480);
      var bmp = await graphic.toBMP();
      fs.writeFileSync("data/out/orthogonal-caspics-640-480.bmp", bmp);
      assert.equal(sha256(bmp), readGolden("caspics-640x480.bmp.sha256"));
    });

    it("composites 640x480 PNG and matches golden digest", async function () {
      if (!hasFixtures) {
        this.skip();
      }
      var image = pl8.Image.buffer(caspics);
      var graphic = pl8.GraphicFactory.Pl8(image, palette, caspics);
      var png = await graphic.toPNG();
      fs.writeFileSync("data/out/orthogonal-caspics-640-480.png", png);
      assert.equal(sha256(png), readGolden("caspics-640x480.png.sha256"));
    });

    it("Image.Orthogonal delegates to GraphicFactory", async function () {
      if (!hasFixtures) {
        this.skip();
      }
      var image = pl8.Image.buffer(caspics);
      var viaFactory = pl8.GraphicFactory.Pl8(image, palette, caspics);
      var viaImage = image.Orthogonal(palette);
      var a = await viaFactory.toPNG();
      var b = await viaImage.toPNG();
      assert.equal(sha256(a), sha256(b));
    });
  });
});
