var assert = require('assert');
var fs = require('fs');
var pl8 = require('../dist/index');

xdescribe('Isomentric Image', function () {
    var caspics;
    this.beforeAll(function() {
        caspics = fs.readFileSync('data/Mtns1a.pl8');
    });
  describe('og Parser', function () {
    it('should return -1 when the value is not present', function () {
       var image = pl8.Image.buffer(caspics);
       console.log(image);

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
       console.log(image);

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

    //   assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});