import { state } from "./state.js";
import { isInsideGrid, isBlocked, isBox, isLockedDoor } from "./collision.js";

// 1. Generate the four neighbouring positions
function getNeighborCells() {
    let dxy = [[0,0],[-1,0],[0,-1],[0,1],[1,0]];
    /*
    let priority = [];
    for (let i=0; i < dxy.length; i++){
        let u = state.enemy.row + dxy[i][0];
        let v = state.enemy.col + dxy[i][1];
        if (isValidMove(u,v)) {
            let val = Math.abs(state.player.row - u) + 
            Math.abs(state.player.col - v);
            priority.push([val,u,v]);
        }
    }
    priority.sort();
    return [priority[0][1],priority[0][2]];
    */

    let grid = []

    for(let i = 0 ; i < state.SIZE ; i++){

        let gridRow = []
        for(let j = 0 ; j < state.SIZE ; j++){

            let cell = Number.MIN_VALUE ;
            if(!isValidMove(i,j))
            {
                cell = -1 ;
            }
            gridRow.push(cell) ;
        }
        grid.push(gridRow);
    }

    const playerRow = state.player.row , playerCol = state.player.col ;
    let queue = [[0,playerRow,playerCol]] ; 
    
    while (queue.length > 0){

        const [dist,u,v] = queue.shift() ; 

        for (const [x,y] of dxy){
            const dx = u + x ; 
            const dy = v + y ;

            if (isValidMove(dx,dy) &&
                grid[dx][dy] === Number.MIN_VALUE
            ) {
                queue.push([dist+1,dx,dy]) ; 
                grid[dx][dy] = dist + 1;
            }
        }
    }

    console.table(grid);


    let minDis = Number.MAX_VALUE , minRow = state.enemy.row , minCol = state.enemy.col ;
    let enemyRow = state.enemy.row , enemyCol = state.enemy.col ;
    for (const [x,y] of dxy){
        const dx = enemyRow + x ; 
        const dy = enemyCol + y ; 

        if (isValidMove(dx,dy) && 
            minDis > grid[dx][dy]
        ){
            minDis = grid[dx][dy] ; 
            minRow = dx ; 
            minCol = dy ;
        }
    }

    return [minRow,minCol] ;



}

function isValidMove(row, col) {
    if (isInsideGrid(row,col) && !isBox(row,col) && 
    !isBlocked(row,col) && !isLockedDoor(row,col)){
        return true;
    }return false;
}

// Move enemy to the highest-priority valid position
export function moveEnemy() {
    const [newRow,newCol] = getNeighborCells();
    state.enemy.row = newRow ;
    state.enemy.col = newCol ;
    return true;
}

export function isEnemyCaughtPlayer(){
    return ((state.player.row === state.enemy.row)&&
            (state.player.col === state.enemy.col));
}
