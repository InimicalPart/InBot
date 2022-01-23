const jimp = require('jimp')

let coords = {
    black: {
        a1: [448, 0],
        a2: [448, 64],
        a3: [448, 128],
        a4: [448, 192],
        a5: [448, 256],
        a6: [448, 320],
        a7: [448, 384],
        a8: [448, 448],
        b1: [384, 0],
        b2: [384, 64],
        b3: [384, 128],
        b4: [384, 192],
        b5: [384, 256],
        b6: [384, 320],
        b7: [384, 384],
        b8: [384, 448],
        c1: [320, 0],
        c2: [320, 64],
        c3: [320, 128],
        c4: [320, 192],
        c5: [320, 256],
        c6: [320, 320],
        c7: [320, 384],
        c8: [320, 448],
        d1: [256, 0],
        d2: [256, 64],
        d3: [256, 128],
        d4: [256, 192],
        d5: [256, 256],
        d6: [256, 320],
        d7: [256, 384],
        d8: [256, 448],
        e1: [192, 0],
        e2: [192, 64],
        e3: [192, 128],
        e4: [192, 192],
        e5: [192, 256],
        e6: [192, 320],
        e7: [192, 384],
        e8: [192, 448],
        f1: [128, 0],
        f2: [128, 64],
        f3: [128, 128],
        f4: [128, 192],
        f5: [128, 256],
        f6: [128, 320],
        f7: [128, 384],
        f8: [128, 448],
        g1: [64, 0],
        g2: [64, 64],
        g3: [64, 128],
        g4: [64, 192],
        g5: [64, 256],
        g6: [64, 320],
        g7: [64, 384],
        g8: [64, 448],
        h1: [0, 0],
        h2: [0, 64],
        h3: [0, 128],
        h4: [0, 192],
        h5: [0, 256],
        h6: [0, 320],
        h7: [0, 384],
        h8: [0, 448],
    },
    white: {
        a1: [0, 448],
        a2: [0, 384],
        a3: [0, 320],
        a4: [0, 256],
        a5: [0, 192],
        a6: [0, 128],
        a7: [0, 64],
        a8: [0, 0],
        b1: [64, 448],
        b2: [64, 384],
        b3: [64, 320],
        b4: [64, 256],
        b5: [64, 192],
        b6: [64, 128],
        b7: [64, 64],
        b8: [64, 0],
        c1: [128, 448],
        c2: [128, 384],
        c3: [128, 320],
        c4: [128, 256],
        c5: [128, 192],
        c6: [128, 128],
        c7: [128, 64],
        c8: [128, 0],
        d1: [192, 448],
        d2: [192, 384],
        d3: [192, 320],
        d4: [192, 256],
        d5: [192, 192],
        d6: [192, 128],
        d7: [192, 64],
        d8: [192, 0],
        e1: [256, 448],
        e2: [256, 384],
        e3: [256, 320],
        e4: [256, 256],
        e5: [256, 192],
        e6: [256, 128],
        e7: [256, 64],
        e8: [256, 0],
        f1: [320, 448],
        f2: [320, 384],
        f3: [320, 320],
        f4: [320, 256],
        f5: [320, 192],
        f6: [320, 128],
        f7: [320, 64],
        f8: [320, 0],
        g1: [384, 448],
        g2: [384, 384],
        g3: [384, 320],
        g4: [384, 256],
        g5: [384, 192],
        g6: [384, 128],
        g7: [384, 64],
        g8: [384, 0],
        h1: [448, 448],
        h2: [448, 384],
        h3: [448, 320],
        h4: [448, 256],
        h5: [448, 192],
        h6: [448, 128],
        h7: [448, 64],
        h8: [448, 0],
    }
}

let coords_color = {
        a1: "black",
        a2: "white",
        a3: "black",
        a4: "white",
        a5: "black",
        a6: "white",
        a7: "black",
        a8: "white",
        b1: "white",
        b2: "black",
        b3: "white",
        b4: "black",
        b5: "white",
        b6: "black",
        b7: "white",
        b8: "black",
        c1: "black",
        c2: "white",
        c3: "black",
        c4: "white",
        c5: "black",
        c6: "white",
        c7: "black",
        c8: "white",
        d1: "white",
        d2: "black",
        d3: "white",
        d4: "black",
        d5: "white",
        d6: "black",
        d7: "white",
        d8: "black",
        e1: "black",
        e2: "white",
        e3: "black",
        e4: "white",
        e5: "black",
        e6: "white",
        e7: "black",
        e8: "white",
        f1: "white",
        f2: "black",
        f3: "white",
        f4: "black",
        f5: "white",
        f6: "black",
        f7: "white",
        f8: "black",
        g1: "black",
        g2: "white",
        g3: "black",
        g4: "white",
        g5: "black",
        g6: "white",
        g7: "black",
        g8: "white",
        h1: "white",
        h2: "black",
        h3: "white",
        h4: "black",
        h5: "white",
        h6: "black",
        h7: "white",
        h8: "black",
}

async function fenToImage({fen, color, whiteCheck, blackCheck, lastMove, dirsave}) {

    if(!fen) return console.log(new Error('You don\'t put the FEN!'))
    if(!color) return console.log(new Error('You don\'t put the color!'))
    if(whiteCheck === undefined) return console.log(new Error('You don\'t put the white check!'))
    if(blackCheck === undefined) return console.log(new Error('You don\'t put the black check!'))
    if(lastMove === undefined) return console.log(new Error('You don\'t put the last move!'))
    if(!dirsave) return console.log(new Error('You don\'t put the directory for save!'))

    if(typeof fen !== "string") return console.log(new Error('The FEN must be a string!'))
    if(typeof color !== "string") return console.log(new Error('The color must be a string!'))
    if(typeof whiteCheck !== "boolean") return console.log(new Error('The white check must be a boolean!'))
    if(typeof blackCheck !== "boolean") return console.log(new Error('The black check must be a boolean!'))
    if(!["string", "boolean"].includes(typeof lastMove)) return console.log(new Error('The last move must be a string or boolean!'))
    if(typeof dirsave !== "string") return console.log(new Error('The directory for save must be a string!'))

    if(lastMove === false) lastMove = "nono"

    if(!["black", "white"].includes(color)) return console.log(new Error('The color must be "black" or "white"!'))

    if(lastMove.length !== 4) return console.log('last move characters maximum is 4!')

    let lastMoveOBJ = {
        first: lastMove.slice(0, 2),
        last: lastMove.slice(2, 4)
    }

    if(!coords_color[lastMoveOBJ.first] && lastMoveOBJ.first !== "no") return console.log('The first coordinate of the last move is invalid!')
    if(!coords_color[lastMoveOBJ.last] && lastMoveOBJ.last !== "no") return console.log('The last coordinate of the last move is invalid!')

    fen = fen.split(" ")[0].split("")

    let newFen = []

    fen.forEach(fe => {

        if(fe === "0" || fe === "1" || fe === "2" || fe === "3" || fe === "4" || fe === "5" || fe === "6" || fe === "7" || fe === "8") {

            for(let o = 0; o < parseInt(fe); o++) {
                newFen.push("1")
            }

        } else {
            newFen.push(fe)
        }

    })

    fen = newFen

    let board;
    if(color === "white") board = await jimp.read("https://i.imgur.com/GNE2MVr.png")
    if(color === "black") board = await jimp.read("https://i.imgur.com/R4Ili7G.png")
    let selectedwhite = await jimp.read("https://i.imgur.com/RXEKVw5.png")
    let selectedblack = await jimp.read("https://i.imgur.com/ePfz8DY.png")
    let check = await jimp.read("https://i.imgur.com/pvwuLmD.png")

    let selected = {
        white: selectedwhite,
        black: selectedblack
    }

    //pieces
    let whiteKing = await jimp.read("https://i.imgur.com/5Q2T0kU.png")
    let whiteQueen = await jimp.read("https://i.imgur.com/Ec7gM72.png")
    let whiteRook = await jimp.read("https://i.imgur.com/EPHqI2s.png")
    let whiteBishop = await jimp.read("https://i.imgur.com/yhvX8Db.png")
    let whiteKnight = await jimp.read("https://i.imgur.com/GXXdnFY.png")
    let whitePawn = await jimp.read("https://i.imgur.com/2mNr6i0.png")
    let blackKing = await jimp.read("https://i.imgur.com/cuVlwoS.png")
    let blackQueen = await jimp.read("https://i.imgur.com/abksR7I.png")
    let blackRook = await jimp.read("https://i.imgur.com/vUR9bdt.png")
    let blackBishop = await jimp.read("https://i.imgur.com/JVoTcMP.png")
    let blackKnight = await jimp.read("https://i.imgur.com/WtsGtXK.png")
    let blackPawn = await jimp.read("https://i.imgur.com/WRfYO0A.png")

    whiteKing.resize(64, 64)
    whiteQueen.resize(64, 64)
    whiteRook.resize(64, 64)
    whiteBishop.resize(64, 64)
    whiteKnight.resize(64, 64)
    whitePawn.resize(64, 64)
    blackKing.resize(64, 64)
    blackQueen.resize(64, 64)
    blackRook.resize(64, 64)
    blackBishop.resize(64, 64)
    blackKnight.resize(64, 64)
    blackPawn.resize(64, 64)

    let pieces = {
        r: blackRook,
        n: blackKnight,
        b: blackBishop,
        q: blackQueen,
        k: blackKing,
        p: blackPawn,
        R: whiteRook,
        N: whiteKnight,
        B: whiteBishop,
        Q: whiteQueen,
        K: whiteKing,
        P: whitePawn
    }

    let ltn = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 6,
        g: 7,
        h: 8
    }

    let ntl = {
        "1": "a",
        "2": "b",
        "3": "c",
        "4": "d",
        "5": "e",
        "6": "f",
        "7": "g",
        "8": "h"
    }

    board.resize(512, 512)

    let atualCoord = {letter: "a", number: 8}
    
    fen.forEach(fe => {

        if(fe === "/") return

        if(fe === "1") {

            if([lastMoveOBJ.first, lastMoveOBJ.last].includes(`${atualCoord.letter}${atualCoord.number}`)) {
                board.composite(selected[coords_color[`${atualCoord.letter}${atualCoord.number}`]], coords[color][`${atualCoord.letter}${atualCoord.number}`][0], coords[color][`${atualCoord.letter}${atualCoord.number}`][1])
            }

        if(atualCoord.letter === "h") {
            atualCoord.letter = "a"
            if(atualCoord.number !== 1) atualCoord.number = atualCoord.number - 1
        } else {
            atualCoord.letter = ntl[`${ltn[atualCoord.letter] + 1}`]
        }

        } else {

        if(fe === "K") {
            if(whiteCheck === true) {
                board.composite(check, coords[color][`${atualCoord.letter}${atualCoord.number}`][0], coords[color][`${atualCoord.letter}${atualCoord.number}`][1])
            }
        }

        if(fe === "k") {
            if(blackCheck === true) {
                board.composite(check, coords[color][`${atualCoord.letter}${atualCoord.number}`][0], coords[color][`${atualCoord.letter}${atualCoord.number}`][1])
            }
        }

        if([lastMoveOBJ.first, lastMoveOBJ.last].includes(`${atualCoord.letter}${atualCoord.number}`)) {
            board.composite(selected[coords_color[`${atualCoord.letter}${atualCoord.number}`]], coords[color][`${atualCoord.letter}${atualCoord.number}`][0], coords[color][`${atualCoord.letter}${atualCoord.number}`][1])
        }

        board.composite(pieces[fe], coords[color][`${atualCoord.letter}${atualCoord.number}`][0], coords[color][`${atualCoord.letter}${atualCoord.number}`][1])

        if(atualCoord.letter === "h") {
            atualCoord.letter = "a"
            if(atualCoord.number !== 1) atualCoord.number = atualCoord.number - 1
        } else {
            atualCoord.letter = ntl[`${ltn[atualCoord.letter] + 1}`]
        }

        }

    })

    return board.write(dirsave)

}

module.exports = fenToImage