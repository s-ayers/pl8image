# Test fixtures

Game assets used by the test suite are **not** committed (see `.gitignore` → `data/`).
Obtain them from a Lords of the Realm 2 install (e.g. GOG).

## Required files

| Path | Source (typical GOG install) |
|------|------------------------------|
| `data/Mtns1a.pl8` | `Mtns1a.pl8` |
| `data/Base01.256` | `Base01.256` |
| `data/out/` | Create empty; test exports land here |

Optional (orthogonal / Caspics suite — skipped when missing):

| Path | Source |
|------|--------|
| `data/Caspics.pl8` | `Caspics.pl8` |
| `data/Cas_back.256` | `Cas_back.256` |

Optional (RLE / type-1 suite — skipped when missing):

| Path | Source | Notes |
|------|--------|-------|
| `data/A2_miss.pl8` | `A2_miss.pl8` | Recommended; 81 small tiles |
| `data/Base01.256` | `Base01.256` | Used only to exercise export path |

Other type-1 (chunk RLE) examples in a typical install: `A2b_knig.pl8`,
`Peasant.pl8`, `Engine.pl8`. File type `1` uses chunk RLE per
[`docs/.pl8.rst`](.pl8.rst); each tile’s stream length is
`nextTile.offset - tile.offset` (last tile runs to EOF).

## Setup

```bash
mkdir -p data/out
# Adjust the game directory to your install:
GAME="$HOME/Desktop/GOG Games/Lords of the Realm II"
ln -sf "$GAME/Mtns1a.pl8" data/Mtns1a.pl8
ln -sf "$GAME/Base01.256" data/Base01.256
# Optional orthogonal fixture:
ln -sf "$GAME/Caspics.pl8" data/Caspics.pl8
ln -sf "$GAME/Cas_back.256" data/Cas_back.256
# Optional RLE fixture:
ln -sf "$GAME/A2_miss.pl8" data/A2_miss.pl8
```

Copy instead of symlink if you prefer:

```bash
cp "$GAME/Mtns1a.pl8" "$GAME/Base01.256" data/
cp "$GAME/Caspics.pl8" "$GAME/Cas_back.256" data/
cp "$GAME/A2_miss.pl8" data/
```

## Golden digests

Committed SHA-256 digests of composed exports live under `test/golden/`.
Integration tests skip when `data/Mtns1a.pl8` is missing. Orthogonal
synthetic tests always run; the Caspics suite skips when that file is
absent. RLE synthetic tests always run; the `A2_miss` suite skips when
that file is absent.

## Reference (visual only)

A third-party extractor may produce comparable PNGs, e.g.
`MTNS1A.ISO.BASE01.256.PNG` from a pl82png-style tool. Digests hash
**pl8image** output (palette scaling and index-0 alpha), not those files.
