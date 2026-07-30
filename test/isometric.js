var assert = require("assert");
var crypto = require("crypto");
var fs = require("fs");
var path = require("path");
var pl8 = require("../dist/index");
var { Tile } = require("../dist/model/Tile.model");

var FIXTURE_PL8 = "data/Mtns1a.pl8";
var FIXTURE_PAL = "data/Base01.256";
var hasFixtures = fs.existsSync(FIXTURE_PL8) && fs.existsSync(FIXTURE_PAL);

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function readGolden(name) {
  return fs
    .readFileSync(path.join("test/golden", name), "utf8")
    .trim();
}

/**
 * Build a packed ISO diamond (height^2 bytes) with distinct indices.
 * height must be even; width is typically 2*height - 2 for LoTR2 tiles.
 */
function packDiamond(width, height, fillFn) {
  var halfHeight = height / 2;
  var bytes = [];
  var y, x, rowStart, rowStop;
  for (y = 0; y < halfHeight; y += 1) {
    rowStart = (halfHeight - 1 - y) * 2;
    rowStop = rowStart + y * 4 + 2;
    for (x = rowStart; x < rowStop; x += 1) {
      bytes.push(fillFn(x, y));
    }
  }
  for (y = halfHeight; y < height; y += 1) {
    rowStart = (halfHeight - 1 - (height - y - 1)) * 2;
    rowStop = rowStart + (height - y - 1) * 4 + 2;
    for (x = rowStart; x < rowStop; x += 1) {
      bytes.push(fillFn(x, y));
    }
  }
  assert.equal(bytes.length, height * height);
  return Buffer.from(bytes);
}

function packExtras(extraType, width, height, extraRows, fillFn) {
  var halfHeight = height / 2;
  var halfWidth = width / 2;
  var bytes = [];
  var y_, x, y, rightOffset, leftOffset;
  for (y_ = extraRows; y_ > 0; y_ -= 1) {
    rightOffset = extraType === 3 ? halfWidth + 1 : width;
    leftOffset = extraType === 4 ? halfWidth - 1 : 0;
    for (x = leftOffset; x < rightOffset; x += 1) {
      y =
        x <= halfWidth
          ? y_ + (halfHeight - 1) - Math.floor(x / 2)
          : y_ + Math.floor(x / 2) - (halfHeight - 1);
      bytes.push(fillFn(x, y, y_));
    }
  }
  return Buffer.from(bytes);
}

function makeTile(extraType, width, height, extraRows, raw) {
  var tile = new Tile(width, height, 0, raw);
  tile.x = 0;
  tile.y = 0;
  tile.extraType = extraType;
  tile.extraRows = extraRows;
  return tile;
}

describe("Isometric Image", function () {
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
    it("parses Mtns1a header and sample tiles", function () {
      if (!hasFixtures) {
        this.skip();
      }
      var image = pl8.Image.buffer(caspics);

      assert.equal(image.type, 2);
      assert.equal(image.width, 640);
      assert.equal(image.height, 480);
      assert.equal(image.tiles.length, 25);

      assert.equal(image.tiles[0].x, 73);
      assert.equal(image.tiles[0].y, 80);
      assert.equal(image.tiles[0].extraRows, 0);
      assert.equal(image.tiles[0].extraType, 2);
      assert.equal(
        image.tiles[0].raw.length,
        pl8.GraphicFactory.tileSize(2, image.tiles[0].width, image.tiles[0].height, 0),
      );

      assert.equal(image.tiles[1].extraType, 3);
      assert.equal(image.tiles[2].extraType, 4);
      assert.equal(image.tiles[3].extraType, 1);
    });
  });

  describe("binary Parser", function () {
    it("parses with binary parser and slices via tileSize", function () {
      if (!hasFixtures) {
        this.skip();
      }
      var image = pl8.Pl8.parse(caspics);

      assert.equal(image.type, 2);
      assert.equal(image.tiles.length, 25);

      image.tiles.forEach(function (tile) {
        var size = pl8.GraphicFactory.tileSize(
          tile.extraType,
          tile.width,
          tile.height,
          tile.extraRows,
        );
        tile.raw = caspics.slice(tile.offset, tile.offset + size);
        assert.equal(tile.raw.length, size);
      });
    });
  });

  describe("bmp/png export", function () {
    it("composites 640x480 BMP and matches golden digest", async function () {
      if (!hasFixtures) {
        this.skip();
      }
      var image = pl8.Image.buffer(caspics);
      var graphic = pl8.GraphicFactory.Pl8(image, palette, caspics);
      var bmp = await graphic.toBMP();
      fs.writeFileSync("data/out/isometric-bp-640-480.bmp", bmp);
      assert.equal(sha256(bmp), readGolden("mtns1a-640x480.bmp.sha256"));
    });

    it("composites 640x480 PNG and matches golden digest", async function () {
      if (!hasFixtures) {
        this.skip();
      }
      var image = pl8.Image.buffer(caspics);
      var graphic = pl8.GraphicFactory.Pl8(image, palette, caspics);
      var png = await graphic.toPNG();
      fs.writeFileSync("data/out/isometric-bp-640-480.png", png);
      assert.equal(sha256(png), readGolden("mtns1a-640x480.png.sha256"));
    });

    it("Image.Isometric delegates to GraphicFactory", async function () {
      if (!hasFixtures) {
        this.skip();
      }
      var image = pl8.Image.buffer(caspics);
      var viaFactory = pl8.GraphicFactory.Pl8(image, palette, caspics);
      var viaImage = image.Isometric(palette);
      var a = await viaFactory.toPNG();
      var b = await viaImage.toPNG();
      assert.ok(a.equals(b));
    });
  });
});

describe("Isometric synthetic extraRows", function () {
  var palette = Buffer.alloc(1024, 0);

  it("tileSize covers extraType 1–4", function () {
    assert.equal(pl8.GraphicFactory.tileSize(1, 8, 4, 0), 16);
    assert.equal(pl8.GraphicFactory.tileSize(2, 8, 4, 2), 16 + 2 * 8);
    assert.equal(pl8.GraphicFactory.tileSize(3, 8, 4, 2), 16 + 2 * (8 / 2 + 1));
    assert.equal(pl8.GraphicFactory.tileSize(4, 8, 4, 2), 16 + 2 * (8 / 2 + 1));
  });

  function indexAt(graphic, width, x, y) {
    // TypeScript private is erased in dist; tests read the index buffer.
    return graphic.raw.readUInt8(width * y + x);
  }

  it("decodes diamond without magic 450/900 offsets (height != 30)", function () {
    var width = 8;
    var height = 4;
    var diamond = packDiamond(width, height, function (x, y) {
      return 10 + y;
    });
    var tile = makeTile(1, width, height, 0, diamond);
    var graphic = pl8.GraphicFactory.tiles(
      [tile],
      palette,
      Buffer.alloc(0),
      width,
      height,
    );
    // Top tip row y=0 starts at x=2
    assert.equal(indexAt(graphic, width, 2, 0), 10);
    assert.equal(indexAt(graphic, width, 3, 0), 10);
    // Bottom tip y=3
    assert.equal(indexAt(graphic, width, 2, 3), 13);
  });

  it("honors extraRows for extraType 2 (both sides)", function () {
    var width = 8;
    var height = 4;
    var extraRows = 2;
    var diamond = packDiamond(width, height, function () {
      return 1;
    });
    var extras = packExtras(2, width, height, extraRows, function () {
      return 2;
    });
    var raw = Buffer.concat([diamond, extras]);
    assert.equal(
      raw.length,
      pl8.GraphicFactory.tileSize(2, width, height, extraRows),
    );

    var tile = makeTile(2, width, height, extraRows, raw);
    var canvasH = height + extraRows;
    var canvasW = width;
    var graphic = pl8.GraphicFactory.tiles(
      [tile],
      palette,
      Buffer.alloc(0),
      canvasW,
      canvasH,
    );

    // Diamond bottom tip at y = height-1 + extraRows (extras may overwrite top)
    assert.equal(indexAt(graphic, canvasW, 2, height + extraRows - 1), 1);
    // Extra diagonal: x=0, y_=2 → y = 2+(2-1)-0 = 3
    assert.equal(indexAt(graphic, canvasW, 0, 3), 2);
    // Near top of extras: x=halfWidth, y_=1 → y = 1
    assert.equal(indexAt(graphic, canvasW, 4, 1), 2);
  });

  it("left-only extras (extraType 3) consume width/2+1 bytes per row", function () {
    var width = 8;
    var height = 4;
    var extraRows = 1;
    var diamond = packDiamond(width, height, function () {
      return 3;
    });
    var extras = packExtras(3, width, height, extraRows, function () {
      return 4;
    });
    var raw = Buffer.concat([diamond, extras]);
    assert.equal(
      raw.length,
      pl8.GraphicFactory.tileSize(3, width, height, extraRows),
    );
    assert.equal(extras.length, extraRows * (width / 2 + 1));

    var tile = makeTile(3, width, height, extraRows, raw);
    var graphic = pl8.GraphicFactory.tiles(
      [tile],
      palette,
      Buffer.alloc(0),
      width,
      height + extraRows,
    );
    // Left extras: x=0, y_=1 → y = 1+(2-1)-0 = 2
    assert.equal(indexAt(graphic, width, 0, 2), 4);
    // Right side of diamond should not get extra index 4 at far right
    assert.notEqual(indexAt(graphic, width, width - 1, 2), 4);
  });

  it("right-only extras (extraType 4) consume width/2+1 bytes per row", function () {
    var width = 8;
    var height = 4;
    var extraRows = 1;
    var diamond = packDiamond(width, height, function () {
      return 5;
    });
    var extras = packExtras(4, width, height, extraRows, function () {
      return 6;
    });
    var raw = Buffer.concat([diamond, extras]);
    assert.equal(
      raw.length,
      pl8.GraphicFactory.tileSize(4, width, height, extraRows),
    );
    assert.equal(extras.length, extraRows * (width / 2 + 1));

    var tile = makeTile(4, width, height, extraRows, raw);
    var graphic = pl8.GraphicFactory.tiles(
      [tile],
      palette,
      Buffer.alloc(0),
      width,
      height + extraRows,
    );
    // Right extras start at halfWidth-1; x=7, y_=1 → y = 1+floor(7/2)-(2-1) = 1+3-1 = 3
    assert.equal(indexAt(graphic, width, 7, 3), 6);
    // Far left should not be extra index 6
    assert.notEqual(indexAt(graphic, width, 0, 2), 6);
  });
});
