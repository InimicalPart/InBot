# FEN to image

## en-US

This package was made to convert a chess FEN into a board image!

### Instalation

```npm i fen-to-image```

### Example


```js
const FTI = require('fen-to-image')
const path = require('path')

FTI({
  fen: "8/8/5p2/2k2P2/1b2R3/pP6/P1K5/5r2 w - - 1 76", //The FEN of game!
  color: "black", //The color of the side you want to see!
  whiteCheck: false, //If white is in check!
  blackCheck: false, //If black is in check!
  lastMove: "d4c5", //The last move that happened so far; d4: where the piece was; d5: where the piece went; put false for not place!
  dirsave: path.join(__dirname, "board.png") //Where the image will be saved!
})
```
**Resultado:**
![Made by fen-to-image](https://i.imgur.com/rCjXRj2.png)

## pt-BR

Essa package foi feita para converter um FEN de xadrez em uma imagem de um tabuleiro!

### Instalação

```npm i fen-to-image```

### Exemplo


```js
const FTI = require('fen-to-image')
const path = require('path')

FTI({
  fen: "8/8/5p2/2k2P2/1b2R3/pP6/P1K5/5r2 w - - 1 76", //O FEN da partida!
  color: "black", //A cor do lado que você quer ver!
  whiteCheck: false, //Se as brancas estão em xeque!
  blackCheck: false, //Se as pretas estão em xeque!
  lastMove: "d4c5", //o último lance que aconteceu até este momento; d4: onde a peça estava; d5: onde a peça foi; Coloque false para não ter!
  dirsave: path.join(__dirname, "board.png") //Onde a imagem será salva!
})
```
**Resultado:**
![Made by fen-to-image](https://i.imgur.com/rCjXRj2.png)