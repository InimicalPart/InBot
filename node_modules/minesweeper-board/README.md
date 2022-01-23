# Minesweeper-board

A fast, lightweight Node module for generating minesweeper boards.

[![install size](https://packagephobia.com/badge?p=minesweeper-board)](https://packagephobia.com/result?p=minesweeper-board)
[![weekly downloads](https://img.shields.io/npm/dw/minesweeper-board.svg)](https://npmjs.com/package/minesweeper-board)

Installation:

```bash
npm i minesweeper-board

# or

yarn add minesweeper-board
```

Usage:

```js
//cjs:
const { Board } = require('minesweeper-board');

//mjs:
import { Board } from 'minesweeper-board';

const board = new Board(5, 5); //dimension, mines
console.log(board.getBoard());
```

example 5x5 board:

```js
$ node dist/tests/test
[
  [
    Cell { hasMine: false, id: 'A0' },
    Cell { hasMine: false, id: 'A1' },
    Cell { hasMine: false, id: 'A2' },
    Cell { hasMine: true, id: 'A3' },
    Cell { hasMine: true, id: 'A4' }
  ],
  [
    Cell { hasMine: false, id: 'B0' },
    Cell { hasMine: false, id: 'B1' },
    Cell { hasMine: false, id: 'B2' },
    Cell { hasMine: false, id: 'B3' },
    Cell { hasMine: false, id: 'B4' }
  ],
  [
    Cell { hasMine: false, id: 'C0' },
    Cell { hasMine: false, id: 'C1' },
    Cell { hasMine: true, id: 'C2' },
    Cell { hasMine: false, id: 'C3' },
    Cell { hasMine: false, id: 'C4' }
  ],
  [
    Cell { hasMine: false, id: 'D0' },
    Cell { hasMine: false, id: 'D1' },
    Cell { hasMine: false, id: 'D2' },
    Cell { hasMine: true, id: 'D3' },
    Cell { hasMine: true, id: 'D4' }
  ],
  [
    Cell { hasMine: false, id: 'E0' },
    Cell { hasMine: false, id: 'E1' },
    Cell { hasMine: false, id: 'E2' },
    Cell { hasMine: false, id: 'E3' },
    Cell { hasMine: false, id: 'E4' }
  ]
]
```

- `hasMine`: indicates if the cell has a mine or not.
- `id`: a string that can be used to identify a cell.
