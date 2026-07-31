[![Documentation Status](https://readthedocs.org/projects/pl8image/badge/?version=latest)](https://pl8image.readthedocs.io/en/latest/?badge=latest)

# pl8image
pl8 files are bitmap sprites.  pl8image is a library and cmdline tool for converting .pl8 files to bitmaps and pngs.

Supports orthogonal, RLE, and isometric (extraType 1–4) decode via `GraphicFactory`.

## CLI

```bash
npm run build
node bin/index.js -p Mtns1a.pl8 -b Base01.256 --format png -o mtns1a.png
node bin/index.js -p Mtns1a.pl8 -b Base01.256              # BMP next to input
```

| Option | Description |
|--------|-------------|
| `-p` / `--pl8` | Input `.pl8` |
| `-b` / `--256` | Palette `.256` |
| `-o` / `--output` | Output path (default: input with `.bmp`/`.png`) |
| `-f` / `--format` | `bmp` (default) or `png` |

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

## Tests

See [docs/fixtures.md](docs/fixtures.md) for obtaining LoTR2 fixtures under `data/` (gitignored), including optional type-1 RLE samples (`A2_miss.pl8`).
