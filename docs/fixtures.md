# Test fixtures

Game assets used by the test suite are **not** committed (see `.gitignore` → `data/`).
Obtain them from a Lords of the Realm 2 install (e.g. GOG).

## Required files

| Path | Source (typical GOG install) |
|------|------------------------------|
| `data/Mtns1a.pl8` | `Mtns1a.pl8` |
| `data/Base01.256` | `Base01.256` |
| `data/out/` | Create empty; test exports land here |

Optional (orthogonal suite, currently disabled):

| Path | Source |
|------|--------|
| `data/Caspics.pl8` | `Caspics.pl8` |
| `data/Cas_back.256` | `Cas_back.256` |

## Setup

```bash
mkdir -p data/out
# Adjust the game directory to your install:
GAME="$HOME/Desktop/GOG Games/Lords of the Realm II"
ln -sf "$GAME/Mtns1a.pl8" data/Mtns1a.pl8
ln -sf "$GAME/Base01.256" data/Base01.256
```

Copy instead of symlink if you prefer:

```bash
cp "$GAME/Mtns1a.pl8" "$GAME/Base01.256" data/
```

## Golden digests

Committed SHA-256 digests of composed exports live under `test/golden/`.
Integration tests skip when `data/Mtns1a.pl8` is missing.

## Reference (visual only)

A third-party extractor may produce comparable PNGs, e.g.
`MTNS1A.ISO.BASE01.256.PNG` from a pl82png-style tool. Digests hash
**pl8image** output (palette scaling and index-0 alpha), not those files.
