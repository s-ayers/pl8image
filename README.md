[![Documentation Status](https://readthedocs.org/projects/pl8image/badge/?version=latest)](https://pl8image.readthedocs.io/en/latest/?badge=latest)

# pl8image
pl8 files are bitmap sprites.  pl8image is a library and cmdline tool for converting .pl8 files to bitmaps and pngs.

Supports orthogonal, RLE, and isometric (extraType 1–4) decode via `GraphicFactory`.

## CLI

```bash
npm run build
node bin/index.js -p Mtns1a.pl8 -b Base01.256 -o mtns1a.png
node bin/index.js -p Mtns1a.pl8 -b Base01.256 --format bmp
node bin/index.js -p Caspics.pl8 -b Cas_back.256 --sprites -o out/caspics.png
```

| Option | Description |
|--------|-------------|
| `-p` / `--pl8` | Input `.pl8` |
| `-b` / `--256` | Palette `.256` |
| `-o` / `--output` | Output path (default: input with `.png`/`.bmp`); stem when `--sprites` |
| `-f` / `--format` | `png` (default) or `bmp` |
| `--width` / `--height` | Composition canvas size (default 640×480) |
| `--sprites` | Export each sprite as a separate image (`stem-000.png`, …) |

PNG treats palette index 0 as fully transparent (alpha 0).

## Docker

Build and run the CLI with Docker. Mount a directory containing your `.pl8` and `.256` files; the image is written next to the input.

```bash
docker compose build
docker compose run --rm pl8image -p ./MySprite.pl8 -b ./MyPal.256
```

Or without Compose:

```bash
docker build -t pl8image .
docker run --rm -v "$PWD:/work" -w /work pl8image -p ./MySprite.pl8 -b ./MyPal.256
```

## Tests

See [docs/fixtures.md](docs/fixtures.md) for obtaining LoTR2 fixtures under `data/` (gitignored), including optional Caspics (orthogonal) and `A2_miss.pl8` (RLE) samples.
