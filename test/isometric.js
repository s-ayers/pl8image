var assert = require('assert');
var fs = require('fs');
var pl8 = require('../dist/index');

describe('Isometric Image', function () {
  var caspics;
  var palette;
  this.beforeAll(async function () {
    caspics = fs.readFileSync('data/Mtns1a.pl8');
    palette = await pl8.Palette.file('data/Base01.256');
    if (fs.existsSync('data/out/isometric-bp.bmp')) {
      fs.unlinkSync('data/out/isometric-bp.bmp');
    }
    if (fs.existsSync('data/out/isometric-bp-640-480.bmp')) {
      fs.unlinkSync('data/out/isometric-bp-640-480.bmp');
    }
  });
  describe('og Parser', function () {
    it('should return -1 when the value is not present', function () {
      var image = pl8.Image.buffer(caspics);

      assert.equal(image.type, 2);
      assert.equal(image.width, 640);
      assert.equal(image.height, 480);

      assert.equal(image.tiles.length, 25);

      assert.equal(image.tiles[0].x, 73);
      assert.equal(image.tiles[0].y, 80);
      assert.equal(image.tiles[0].extraRows, 0);
      assert.equal(image.tiles[0].extraType, 2);

      assert.equal(image.tiles[1].x, 43);
      assert.equal(image.tiles[1].y, 95);
      assert.equal(image.tiles[1].extraRows, 0);
      assert.equal(image.tiles[1].extraType, 3);

      assert.equal(image.tiles[2].x, 103);
      assert.equal(image.tiles[2].y, 95);
      assert.equal(image.tiles[2].extraRows, 0);
      assert.equal(image.tiles[2].extraType, 4);

      assert.equal(image.tiles[3].x, 73);
      assert.equal(image.tiles[3].y, 110);
      assert.equal(image.tiles[3].extraRows, 0);
      assert.equal(image.tiles[3].extraType, 1);

    });
  });

  describe('binary Parser', function () {
    it('should parse with binary parser', function () {
      var image = pl8.Pl8.parse(caspics);

      assert.equal(image.type, 2);
      // assert.equal(image.width, 640);
      // assert.equal(image.height, 480);

      assert.equal(image.tiles.length, 25);

      // assert.equal(image.tiles[0].x, 0);
      // assert.equal(image.tiles[0].y, 0);
      // assert.equal(image.tiles[0].extraRows, 0);
      // assert.equal(image.tiles[0].type, 0);

      // assert.equal(image.tiles[1].x, 320);
      // assert.equal(image.tiles[1].y, 0);
      // assert.equal(image.tiles[1].extraRows, 0);
      // assert.equal(image.tiles[1].type, 0);

      // assert.equal(image.tiles[2].x, 0);
      // assert.equal(image.tiles[2].y, 200);
      // assert.equal(image.tiles[2].extraRows, 0);
      // assert.equal(image.tiles[2].type, 0);

      // assert.equal(image.tiles[3].x, 320);
      // assert.equal(image.tiles[3].y, 200);
      // assert.equal(image.tiles[3].extraRows, 0);
      // assert.equal(image.tiles[3].type, 0);
      image.tiles.forEach(tile => {
        var size = pl8.GraphicFactory.tileSize(tile.extraType, tile.width, tile.height, tile.extraRows);
        tile.raw = caspics.slice(tile.offset, tile.offset + size);
      });

    });
  });
  describe('bmp export - binary Parser', function () {
    it('export single file', async function () {
      var image = pl8.Pl8.parse(caspics);

      var graphic = pl8.GraphicFactory.tiles(image.tiles, palette, caspics);
      var bmp = await graphic.toBMP();
      fs.writeFileSync('data/out/isometric-bp.bmp', bmp);
    });
    it('export single file - override height - width', async function () {
      var image = pl8.Pl8.parse(caspics);

      var graphic = pl8.GraphicFactory.tiles(image.tiles, palette, caspics, 640, 480);
      var bmp = await graphic.toBMP();
      fs.writeFileSync('data/out/isometric-bp-640-480.bmp', bmp);

    });
  });
});