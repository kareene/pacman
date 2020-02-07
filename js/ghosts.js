var GHOST = '&#9781;';

var gIntervalGhosts;
var gGhosts;
var gRemovedGhosts = [];

function createGhost(board) {
    var ghost = {
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: getRandomColor()
    };
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
}

function createGhosts(board) {
    // empty the gGhosts array, create some ghosts
    gGhosts = [];
    createGhost(board)
    createGhost(board)
    createGhost(board)
    //  and run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 3000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];

        // Create the moveDiff
        var moveDiff = getMoveDiff();
        var nextLocation =
        {
            i: ghost.location.i + moveDiff.i,
            j: ghost.location.j + moveDiff.j
        }

        // if WALL - give up
        if (gBoard[nextLocation.i][nextLocation.j] === WALL) continue;

        // if GHOST - give up
        if (gBoard[nextLocation.i][nextLocation.j] === GHOST) continue;

        // if PACMAN - gameOver or ghost dies
        if (gBoard[nextLocation.i][nextLocation.j] === PACMAN) {
            if (gPacman.iSuper) { 
                // if Pacman is in super mode - ghost dies
                removeGhost(nextLocation.i, nextLocation.j);
                continue;
            } else {
                gameOver();
                return;
            }
        }

        // set back what we stepped on: update Model, DOM
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
        renderCell(ghost.location, ghost.currCellContent)

        // move the ghost
        ghost.location = nextLocation

        // keep the contnet of the cell we are going to
        ghost.currCellContent = gBoard[nextLocation.i][nextLocation.j]

        // move the ghost and update model and dom
        gBoard[ghost.location.i][ghost.location.j] = GHOST
        renderCell(ghost.location, getGhostHTML(ghost))
    }
}

function getMoveDiff() {
    var randNum = getRandomIntInclusive(0, 100)
    if (randNum < 25) {
        return { i: 0, j: 1 }
    } else if (randNum < 50) {
        return { i: -1, j: 0 }
    } else if (randNum < 75) {
        return { i: 0, j: -1 }
    } else {
        return { i: 1, j: 0 }
    }
}

function getGhostHTML(ghost) {
    return `<span style="color:${ghost.color};">${GHOST}</span>`
}

function changeGhostsColor() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        ghost.color = 'white';
        renderCell(ghost.location, getGhostHTML(ghost));
    }
}

function removeGhost(posI, posJ) {
    var ghostIdx;
    for (var i = 0; i < gGhosts.length; i++) {
        if (gGhosts[i].location.i === posI && gGhosts[i].location.j === posJ) {
            ghostIdx = i;
            break;
        }
    }
    var ghost = gGhosts[ghostIdx];
    gBoard[ghost.location.i][ghost.location.j] = EMPTY;
    renderCell(ghost.location, EMPTY);
    gRemovedGhosts.push(gGhosts.splice(ghostIdx, 1)[0]);
}

function returnAllGhosts() {
    gGhosts.push(...gRemovedGhosts);
    gRemovedGhosts = [];
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        ghost.color = getRandomColor();
        renderCell(ghost.location, getGhostHTML(ghost));
    }
}