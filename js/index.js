'use strict'

const MINE = '💣';

var gLevel = {
    SIZE: 8,
    MINES: 5,
    LEVELNUMBER: 1
};
var gState = {
    isGameOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gBoard;
var clicks = 0;
var minesCount;;

function initGame() {
    minesCount = gLevel.MINES;
    
    gBoard = buildBoard();
    console.table(gBoard);
    renderBoard(gBoard);
    document.querySelector('.mines-count').innerHTML = gLevel.MINES;
    document.querySelector('.level-class').innerHTML = gLevel.LEVELNUMBER;
    var bestTime = localStorage.getItem(`level-${gLevel.LEVELNUMBER}`);
    document.querySelector('.level-time').innerHTML = bestTime;

}



function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                id: { i: i, j: j }
            };
        }
    }
    return board;
}

//CR: better use while loop but all good in general 
function randomMine(elCell, cellI, cellJ) {
    for (var idx = 0; idx < gLevel.MINES; idx++) {
        var i = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var j = getRandomIntInclusive(0, gLevel.SIZE - 1);
        var mineLoc = { i: i, j: j };
        if (gBoard[mineLoc.i][mineLoc.j].isMine) {
            idx--;
            continue;
        }
        if(i=== cellI && j === cellJ){
            idx--
            continue;
        }
        gBoard[mineLoc.i][mineLoc.j].isMine = true;

        setMinesNegsCount(mineLoc);
    }

}

function renderBoard(board) {

    var elContainer = document.querySelector('.board-mine');

    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {

            var className = 'cell cell' + i + '-' + j;
            strHTML += `<td onmousedown="cellMarked(event, this, ${i}, ${j})" onclick="cellClicked(this, ${i}, ${j})" class="${className}"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    elContainer.innerHTML = strHTML;
}
//CR: nice thought
function setMinesNegsCount(cell) {
    for (var i = cell.i - 1; i <= cell.i + 1; i++) {
        for (var j = cell.j - 1; j <= cell.j + 1; j++) {
            if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard.length) continue;
            if (i === cell.i && j === cell.j) continue;
            if (!gBoard[i][j].isMine) {
                gBoard[i][j].minesAroundCount++;
            }
        }
    }
}

function cellClicked(elCell, i, j) {
    if (gState.isGameOn) {
        clicks++;
        
    //CR: its better if it would be in gState and name it gClicks
        if(clicks === 1){
            randomMine(elCell, i, j);
            timer();
        }


        var currClass = document.querySelector(`.cell${i}-${j}`);

        // check if has a flag
        if (!gBoard[i][j].isMarked) {

            // console.log('el', elCell);
            elCell.classList.add('show');


            if (gBoard[i][j].isMine) {
                elCell.innerHTML = MINE
            } else if (gBoard[i][j].minesAroundCount > 0) {
                elCell.innerHTML = gBoard[i][j].minesAroundCount;

                gState.shownCount++;
                // console.log('show count', gState.shownCount);

                // console.log(elCell);
                currClass.classList.add(colorNums(elCell));
            } else {
                elCell.innerHTML = '';
            }



            if (gBoard[i][j].isShown === false) {
                gBoard[i][j].isShown = true

                // console.log('showncount:', gState.shownCount);
            }



            if (elCell.innerHTML === MINE) {
                document.querySelector('.smiley').innerHTML = '😞';
                elCell.style.backgroundColor = 'red';
                // console.log('game over');
                gState.isGameOn = false;
                clearInterval(startTimer);
                for (var i = 0; i < gBoard.length; i++) {
                    for (var j = 0; j < gBoard.length; j++) {
                        if (gBoard[i][j].isMine) {
                            // console.log('mine');
                            var currMine = document.querySelector(`.cell${i}-${j}`);
                            currMine.classList.add('show');
                            currMine.innerHTML = MINE
                            
                            if(gBoard[i][j].isMarked){
                                currMine.innerHTML = '🎯';
                            }
                        }
                    }
                }
            }
            if (elCell.innerHTML === '') {
                gState.shownCount++;

                expandShown(i, j)
            }
        }
    }

    //check victory
    var endGame = gLevel.SIZE * gLevel.SIZE - gLevel.MINES;
    if (gState.shownCount === endGame) {
        document.querySelector('.smiley').innerHTML = '😎';

        for(var i = 0; i < gBoard.length; i++){
            for(var j = 0; j < gBoard.length; j++){
                if(gBoard[i][j].isMine){
                    document.querySelector(`.cell${i}-${j}`).innerHTML = '🏳️';
                }
            }
        }

        clearInterval(startTimer);
        gState.isGameOn = false;
        var localBestTime = localStorage.getItem(`level-${gLevel.LEVELNUMBER}`);
        if(gState.secsPassed < localBestTime || localBestTime === null){
            localStorage.setItem(`level-${gLevel.LEVELNUMBER}`, gState.secsPassed);
        }
    }
}


function expandShown(i, j) {
    for (var idx = i - 1; idx <= i + 1; idx++) {
        for (var jdx = j - 1; jdx <= j + 1; jdx++) {
            if (idx < 0 || idx >= gBoard.length || jdx < 0 || jdx >= gBoard.length) continue;
            if (i === idx && j === jdx) continue;
            if (gBoard[idx][jdx].isShown) continue;
            if(gBoard[idx][jdx].isMarked) continue;
            if (gBoard[idx][jdx].isMine) continue;
            if (gBoard[idx][jdx].minesAroundCount > 0) {
                gBoard[idx][jdx].isShown = true;
                var corNum = document.querySelector(`.cell${idx}-${jdx}`);
                corNum.classList.add('show');
                corNum.innerHTML = gBoard[idx][jdx].minesAroundCount;
                corNum.classList.add(colorNums(corNum));
                gState.shownCount++;
                continue;
            }
            if (gBoard[idx][jdx].isShown) continue;

            gBoard[idx][jdx].isShown = true;
            document.querySelector(`.cell${idx}-${jdx}`).classList.add('show');
            document.querySelector(`.cell${idx}-${jdx}`).innerHTML = '';
            gState.shownCount++;
            expandShown(idx, jdx);
        }
    }
}

//marked cell click as a flag
function cellMarked(elCell, elClick, i, j) {
    // console.log(elClick);
    //CR: It would be eaiser to add it inline in the render function//
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }, false);

    //CR: you could check for right click in the cellclicked function and then invoke cellmarked,
    // now cellmarked is invoked on every click.
    if (elCell.button === 2) {
        if (!gBoard[i][j].isShown) {

            if (elClick.innerHTML === '🏳️') {

                elClick.innerHTML = '';
                gBoard[i][j].isMarked = false;
                gState.markedCount--;
                minesCount++;
                document.querySelector('.mines-count').innerHTML = minesCount;

            } else {
                elClick.innerHTML = '🏳️';
                gBoard[i][j].isMarked = true;
                gState.markedCount++;
                minesCount--;
                document.querySelector('.mines-count').innerHTML = minesCount;
            }
        }
    }
}


