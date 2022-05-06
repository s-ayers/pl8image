var assert = require('assert');
var fs = require('fs');
var pl8 = require('../dist/index');

describe('Orthogonal Image', function () {
  var caspics;
  var palette;
  this.beforeAll(function () {
    caspics = fs.readFileSync('data/Caspics.pl8');
    palette = fs.readFileSync('data/Cas_back.256');
    if (fs.existsSync('test/orthogonal-og.png')) {
      fs.unlinkSync('test/orthogonal-og.png');
    }
    if (fs.existsSync('test/orthogonal-og.bmp')) {
      fs.unlinkSync('test/orthogonal-og.bmp');
    }


  });
  xdescribe('metadata - og Parser', function () {
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
    it('bitmap export', async function () {
      caspics = await pl8.Image.file('data/Village.pl8');
      palette = await pl8.Palette.file('data/Base01.256');
      var image = pl8.Image.buffer(caspics);
      // console.log(image);
      // console.log(palette);
      var graphic = image.Orthogonal(palette);
      console.log(graphic);
      var bmp = await graphic.toBMP();
      console.log(bmp);
      fs.writeFileSync('test/orthogonal-og.bmp', bmp.toString());

    });

    it('png export', async function () {
      caspics = await pl8.Image.file('data/Village.pl8');
      palette = await pl8.Palette.file('data/Base01.256');
      var image = pl8.Image.buffer(caspics);

      var graphic = image.Orthogonal(palette);
      console.log(graphic);
      var png;
      try {
        png = await graphic.toPNG();
      } catch (e) {
        console.log(e);
      }

      console.log(png);
      fs.writeFileSync('test/orthogonal-og.png', png.toString());

    });
  });

  xdescribe('metadata - binary Parser', function () {
    it('should parse with binary parser', function () {
      var image = pl8.Pl8.parse(caspics);
      console.log(image);

      assert.equal(image.type, 0);
      // assert.equal(image.width, 640);
      // assert.equal(image.height, 480);

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

    });
  });
});