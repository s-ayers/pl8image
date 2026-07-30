[![Documentation Status](https://readthedocs.org/projects/pl8image/badge/?version=latest)](https://pl8image.readthedocs.io/en/latest/?badge=latest)

# pl8image
pl8 files are bitmap sprites.  pl8image is a library and cmdline tool for converting .pl8 files to bitmaps and pngs.

## Docker

Build and run the CLI with Docker. Mount a directory containing your `.pl8` and `.256` files; the BMP is written next to the input.

```bash
docker compose build
docker compose run --rm pl8image -p ./MySprite.pl8 -b ./MyPal.256
```

Or without Compose:

```bash
docker build -t pl8image .
docker run --rm -v "$PWD:/work" -w /work pl8image -p ./MySprite.pl8 -b ./MyPal.256
```
