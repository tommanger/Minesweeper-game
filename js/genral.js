var startTimer;

function restartGame() {
    clearInterval(startTimer);
    clicks = 0;
    document.querySelector('.smiley').innerHTML = '😄';
    setTimeout(function () {
        document.querySelector('.smiley').innerHTML = '😃';

    }, 1000)
    gState.shownCount = 0;
    gState.markedCount = 0;
    gState.secsPassed = 0;
    gState.isGameOn = true;
    document.querySelector('.cor-time').innerHTML = 0;

    document.querySelector('.mines-count').innerHTML = gLevel.MINES;
    initGame();

}

function overSmily(event) {
    if (gState.isGameOn) {
        if (event.type === "mouseover") {
            document.querySelector('.smiley').innerHTML = '😊';
        } else {
            document.querySelector('.smiley').innerHTML = '😃';
        }
    }
}

function level(size, mines, levelNum) {
    gLevel.SIZE = size;
    gLevel.MINES = mines
    minesCount = mines;
    restartGame(levelNum);
    gLevel.LEVELNUMBER = levelNum;
    document.querySelector('.level-class').innerHTML = gLevel.LEVELNUMBER;
    var bestTime = localStorage.getItem(`level-${gLevel.LEVELNUMBER}`);
    document.querySelector('.level-time').innerHTML = bestTime;
}

function levelCustom() {
    if (document.querySelector('.custom').style.display === 'block') {
        document.querySelector('.custom').style.display = 'none';
    } else {
        document.querySelector('.custom').style.display = 'block';
    }
}

function sendLevel() {
    var mines = document.querySelector('.m').value;
    var size = document.querySelector('.s').value;
    if (size > 2) {
        if (size < 51) {
            if ((+mines) === ((+size) * (+size))) {
                document.querySelector('.comments').innerHTML = `You need to put a size greater than mines`;

            } else {
                document.querySelector('.comments').innerHTML = ``;
                document.querySelector('.custom').style.display = 'none';
                level(+size, +mines, 4);
            }
        } else {
            document.querySelector('.comments').innerHTML = `You can't put a size greater than 50`;
        }
    } else {
        document.querySelector('.comments').innerHTML = `You need to put a size greater than 2`;
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function colorNums(elCell) {
    var color;
    if (elCell.innerHTML === '1') {
        color = 'blue';
    } else if (elCell.innerHTML === '2') {
        color = 'green';
    } else if (elCell.innerHTML === '3') {
        color = 'red';
    } else {
        color = 'dark-blue'
    }
    return color;
}

function timer() {
    startTimer = setInterval(function () {
        gState.secsPassed++;
        document.querySelector('.cor-time').innerHTML = gState.secsPassed;
    }, 1000)
}