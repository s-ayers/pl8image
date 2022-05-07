var assert = require('assert');
var fs = require('fs');
var pl8 = require('../dist/index');

describe('Orthogonal Image', function () {
  var caspics;
  var palette;
  this.beforeAll(async function () {
    caspics = fs.readFileSync('data/Caspics.pl8');
    palette = await pl8.Palette.file('data/Cas_back.256');
    if (fs.existsSync('data/out/orthogonal-og.png')) {
      fs.unlinkSync('data/out/orthogonal-og.png');
    }
    if (fs.existsSync('data/out/orthogonal-og.bmp')) {
      fs.unlinkSync('data/out/orthogonal-og.bmp');
    }
    if (fs.existsSync('data/out/orthogonal-bp.bmp')) {
      fs.unlinkSync('data/out/orthogonal-bp.bmp');
    }
    if (fs.existsSync('data/out/orthogonal-bp-640-480.bmp')) {
      fs.unlinkSync('data/out/orthogonal-bp-640-480.bmp');
    }
  });
  describe('metadata - og Parser', function () {
    it('should return -parse the file', function () {
      var image = pl8.Image.buffer(caspics);
      console.log(image);

      assert.equal(image.type, 0);
      assert.equal(image.width, 640);
      assert.equal(image.height, 480);

      assert.equal(image.tiles.length, 4);

      assert.equal(image.tiles[0].x, 0);
      assert.equal(image.tiles[0].y, 0);
      assert.equal(image.tiles[0].extraRows, 0);
      assert.equal(image.tiles[0].extraType, 0);

      assert.equal(image.tiles[1].x, 320);
      assert.equal(image.tiles[1].y, 0);
      assert.equal(image.tiles[1].extraRows, 0);
      assert.equal(image.tiles[1].extraType, 0);

      assert.equal(image.tiles[2].x, 0);
      assert.equal(image.tiles[2].y, 200);
      assert.equal(image.tiles[2].extraRows, 0);
      assert.equal(image.tiles[2].extraType, 0);

      assert.equal(image.tiles[3].x, 320);
      assert.equal(image.tiles[3].y, 200);
      assert.equal(image.tiles[3].extraRows, 0);
      assert.equal(image.tiles[3].extraType, 0);

      //   assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });

  describe('export - og Parser', function () {
    it('bitmap export - all sprites', async function () {
      var image = pl8.Image.buffer(caspics);
      var graphic = image.Orthogonal(palette);

      var bmp = await graphic.toBMP();

      fs.writeFileSync('data/out/orthogonal-og.bmp', bmp);

    });

    it('png export - all sprites', async function () {
      var image = pl8.Image.buffer(caspics);

      var graphic = image.Orthogonal(palette);
      var png;
      try {
        png = await graphic.toPNG();
      } catch (e) {
        console.log(e);
      }

      fs.writeFileSync('data/out/orthogonal-og.png', png);

    });
  });

  describe('metadata - binary Parser', function () {
    it('should parse with binary parser', function () {
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
      assert.equal(image.tiles[0].height, 200);
      assert.equal(image.tiles[0].width, 320);
      assert.equal(image.tiles[1].extraRows, 0);
      assert.equal(image.tiles[1].extraType, 0);

      assert.equal(image.tiles[2].x, 0);
      assert.equal(image.tiles[2].y, 200);
      assert.equal(image.tiles[0].height, 200);
      assert.equal(image.tiles[0].width, 320);
      assert.equal(image.tiles[2].extraRows, 0);
      assert.equal(image.tiles[2].extraType, 0);

      assert.equal(image.tiles[3].x, 320);
      assert.equal(image.tiles[3].y, 200);
      assert.equal(image.tiles[0].height, 200);
      assert.equal(image.tiles[0].width, 320);
      assert.equal(image.tiles[3].extraRows, 0);
      assert.equal(image.tiles[3].extraType, 0);

      // console.log(image.tiles[3]);
      // var tile = image.tiles[3];
      // var size = pl8.tileSize(tile.extraType, tile.width, tile.height, tile.extraRows);
      // console.log(size);
      // console.log(tile.offset + size);
      // console.log(caspics.length);

    });
  });

  describe('bmp export - binary Parser', function () {
    it('export single file', async function () {
      var image = pl8.Pl8.parse(caspics);

      var graphic = pl8.GraphicFactory.tiles(image.tiles, caspics, palette);
      var bmp = await graphic.toBMP();
      fs.writeFileSync('data/out/orthogonal-bp.bmp', bmp);
      // console.log(caspics.length);
      // console.log(image);
    });
    it('export single file - override height - width', async function () {
      var image = pl8.Pl8.parse(caspics);

      var graphic = pl8.GraphicFactory.tiles(image.tiles, caspics, palette, 640, 480);
      var bmp = await graphic.toBMP();
      fs.writeFileSync('data/out/orthogonal-bp-640-480.bmp', bmp);

    });
  });

});