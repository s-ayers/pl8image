var assert = require('assert');
var fs = require('fs');
var pl8 = require('../dist/index');

describe('Orthagnal Image', function () {
    var demo;
    this.beforeAll(function() {
        demo = fs.readFileSync('data/Caspics.pl8');
        console.log(demo);
    });
  describe('og Parser', function () {
    it('should return -1 when the value is not present', function () {
       var image = pl8.Image.buffer(demo);
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
});