var assert = require("assert");
var fs = require("fs");
var pl8 = require("../dist/index");

var FIXTURE_PL8 = "data/A2_miss.pl8";
var FIXTURE_PAL = "data/Base01.256";
var hasFixtures = fs.existsSync(FIXTURE_PL8) && fs.existsSync(FIXTURE_PAL);

function indexAt(graphic, width, x, y) {
  return graphic.raw.readUInt8(width * y + x);
}

/** Pack chunk RLE from a flat width×height index buffer (0 = transparent). */
function packRle(pixels, width, height) {
  var out = [];
  var y, x, runStart, runVal, runLen, i;
  for (y = 0; y < height; y += 1) {
    x = 0;
    while (x < width) {
      runVal = pixels[y * width + x];
      runStart = x;
      while (x < width && pixels[y * width + x] === runVal) {
        x += 1;
      }
      runLen = x - runStart;
      if (runVal === 0) {
        while (runLen > 0) {
          var skip = Math.min(runLen, 255);
          out.push(0, skip);
          runLen -= skip;
        }
      } else {
        while (runLen > 0) {
          var copy = Math.min(runLen, 255);
          out.push(copy);
          for (i = 0; i < copy; i += 1) {
            out.push(runVal);
          }
          runLen -= copy;
        }
      }
    }
  }
  return Buffer.from(out);
}

/**
 * Build a type-1 .pl8 buffer.
 * tiles: [{ width, height, x, y, pixels: Buffer|Uint8Array }]
 */
function buildRlePl8(tiles) {
  var n = tiles.length;
  var headerSize = 8 + n * 16;
  var payloads = tiles.map(function (t) {
    return packRle(t.pixels, t.width, t.height);
  });
  var total = headerSize;
  payloads.forEach(function (p) {
    total += p.length;
  });
  var buf = Buffer.alloc(total);
  buf.writeUInt16LE(1, 0);
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
    payloads[i].copy(buf, offset);
    offset += payloads[i].length;
  }
  return buf;
}

function trivialPalette() {
  return Buffer.alloc(1024, 0);
}

describe("RLE synthetic", function () {
  var palette = trivialPalette();

  it("parses type 1 and bounds raw to next tile offset", function () {
    var pixels0 = Buffer.alloc(4, 1); // 2x2 all opaque index 1
    var pixels1 = Buffer.from([2, 2, 0, 0, 3, 3, 0, 0]); // 4x2
    var file = buildRlePl8([
      { width: 2, height: 2, x: 0, y: 0, pixels: pixels0 },
      { width: 4, height: 2, x: 10, y: 0, pixels: pixels1 },
    ]);
    var image = pl8.Image.buffer(file);

    assert.equal(image.type, 1);
    assert.equal(image.tiles.length, 2);

    var packed0 = packRle(pixels0, 2, 2);
    var packed1 = packRle(pixels1, 4, 2);
    assert.equal(image.tiles[0].raw.length, packed0.length);
    assert.equal(image.tiles[1].raw.length, packed1.length);
    assert.ok(image.tiles[0].raw.equals(packed0));
    assert.ok(image.tiles[1].raw.equals(packed1));

    assert.equal(
      pl8.GraphicFactory.rlePayloadEnd(image.tiles, 0, file.length),
      image.tiles[1].offset,
    );
    assert.equal(
      pl8.GraphicFactory.rlePayloadEnd(image.tiles, 1, file.length),
      file.length,
    );
  });

  it("decodes opaque runs into palette indices", function () {
    var width = 4;
    var height = 2;
    var pixels = Buffer.from([5, 5, 5, 5, 7, 7, 7, 7]);
    var file = buildRlePl8([
      { width: width, height: height, x: 0, y: 0, pixels: pixels },
    ]);
    var image = pl8.Image.buffer(file);
    image.width = 0;
    image.height = 0;
    var graphic = pl8.GraphicFactory.Pl8(image, palette, file);

    assert.equal(indexAt(graphic, width, 0, 0), 5);
    assert.equal(indexAt(graphic, width, 3, 0), 5);
    assert.equal(indexAt(graphic, width, 0, 1), 7);
    assert.equal(indexAt(graphic, width, 3, 1), 7);
  });

  it("decodes transparent skips as index 0", function () {
    var width = 6;
    var height = 1;
    // opaque 9, skip 3, opaque 8,8
    var pixels = Buffer.from([9, 0, 0, 0, 8, 8]);
    var file = buildRlePl8([
      { width: width, height: height, x: 0, y: 0, pixels: pixels },
    ]);
    var image = pl8.Image.buffer(file);
    image.width = 0;
    image.height = 0;
    var graphic = pl8.GraphicFactory.Pl8(image, palette, file);

    assert.equal(indexAt(graphic, width, 0, 0), 9);
    assert.equal(indexAt(graphic, width, 1, 0), 0);
    assert.equal(indexAt(graphic, width, 2, 0), 0);
    assert.equal(indexAt(graphic, width, 3, 0), 0);
    assert.equal(indexAt(graphic, width, 4, 0), 8);
    assert.equal(indexAt(graphic, width, 5, 0), 8);
  });

  it("composites mixed runs at tile x/y", function () {
    var width = 4;
    var height = 2;
    var pixels = Buffer.from([1, 0, 2, 2, 0, 0, 3, 0]);
    var file = buildRlePl8([
      { width: width, height: height, x: 2, y: 1, pixels: pixels },
    ]);
    var image = pl8.Image.buffer(file);
    image.width = 0;
    image.height = 0;
    var graphic = pl8.GraphicFactory.Pl8(image, palette, file);
    var canvasW = 2 + width;

    assert.equal(graphic.width, canvasW);
    assert.equal(graphic.height, 1 + height);
    assert.equal(indexAt(graphic, canvasW, 2, 1), 1);
    assert.equal(indexAt(graphic, canvasW, 3, 1), 0);
    assert.equal(indexAt(graphic, canvasW, 4, 1), 2);
    assert.equal(indexAt(graphic, canvasW, 5, 1), 2);
    assert.equal(indexAt(graphic, canvasW, 2, 2), 0);
    assert.equal(indexAt(graphic, canvasW, 4, 2), 3);
  });

  it("Tile.Rle and Pl8Image.Rle use GraphicFactory", async function () {
    var pixels = Buffer.from([4, 4, 4, 4]);
    var file = buildRlePl8([
      { width: 2, height: 2, x: 5, y: 5, pixels: pixels },
    ]);
    var image = pl8.Image.buffer(file);
    var viaFactory = pl8.GraphicFactory.Pl8(image, palette, file);
    var viaImage = image.Rle(palette);
    var a = await viaFactory.toBMP();
    var b = await viaImage.toBMP();
    assert.ok(a.equals(b));

    var tile = image.tiles[0];
    var viaTile = tile.Rle(palette);
    var stride = viaTile.width;
    assert.equal(indexAt(viaTile, stride, 0, 0), 4);
    assert.equal(indexAt(viaTile, stride, 1, 1), 4);
    // Tile helper zeros origin for a local graphic
    assert.equal(tile.x, 5);
    assert.equal(tile.y, 5);
  });

  it("rleImage re-slices empty raw via next offset", function () {
    var pixels0 = Buffer.alloc(4, 1);
    var pixels1 = Buffer.alloc(4, 2);
    var file = buildRlePl8([
      { width: 2, height: 2, x: 0, y: 0, pixels: pixels0 },
      { width: 2, height: 2, x: 2, y: 0, pixels: pixels1 },
    ]);
    var image = pl8.Image.buffer(file);
    image.width = 0;
    image.height = 0;
    image.tiles.forEach(function (t) {
      t.raw = Buffer.alloc(0);
    });
    var graphic = pl8.GraphicFactory.Pl8(image, palette, file);
    assert.equal(image.tiles[0].raw.length, packRle(pixels0, 2, 2).length);
    assert.equal(image.tiles[1].raw.length, packRle(pixels1, 2, 2).length);
    assert.equal(indexAt(graphic, 4, 0, 0), 1);
    assert.equal(indexAt(graphic, 4, 2, 0), 2);
  });
});

describe("RLE fixture A2_miss", function () {
  var raw;
  var palette;

  before(async function () {
    if (!hasFixtures) {
      this.skip();
    }
    raw = fs.readFileSync(FIXTURE_PL8);
    palette = await pl8.Palette.file(FIXTURE_PAL);
  });

  it("parses type 1 with next-offset stream lengths", function () {
    if (!hasFixtures) {
      this.skip();
    }
    var image = pl8.Image.buffer(raw);
    assert.equal(image.type, 1);
    assert.equal(image.tiles.length, 81);

    image.tiles.forEach(function (tile, i) {
      var end = pl8.GraphicFactory.rlePayloadEnd(
        image.tiles,
        i,
        raw.length,
      );
      assert.equal(tile.raw.length, end - tile.offset);
      assert.ok(tile.raw.length > 0);
    });
  });

  it("GraphicFactory.Pl8 decodes without throw", function () {
    if (!hasFixtures) {
      this.skip();
    }
    var image = pl8.Image.buffer(raw);
    var graphic = pl8.GraphicFactory.Pl8(image, palette, raw);
    assert.ok(graphic);
    assert.ok(graphic.raw.length > 0);
  });
});
