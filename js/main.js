import { getCellElementList,
    getCurrentTurnElement,
    getCellElementAtIdx,
    getGameStatusElement, 
    getReplayButtonElemnt} from "./selectors.js";
import {CELL_VALUE, GAME_STATUS, TURN}from './constants.js';
import{ checkGameStatus }from'./utils.js';
// console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']))
// console.log(checkGameStatus(['X', 'O', 'O', 'X', 'O', 'X', 'O', 'O', 'X']))
// console.log(getCellElementList());
// console.log(getCurrentTurnElement());
// console.log(getCellElementAtIdx(4));
// console.log(getGameStatusElement());
/**
 * Global variables
 */
let currentTurn = TURN.CROSS ;
let gamestatus=GAME_STATUS.PLAYING;
let isGameEnded = false;
let cellValues = new Array(9).fill("");
function toggleTurn(){
    currentTurn=currentTurn===TURN.CIRCLE?TURN.CROSS:TURN.CIRCLE;

    const currentTurnElement=getCurrentTurnElement();
    if(currentTurnElement){
        currentTurnElement.classList.remove(TURN.CIRCLE,TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
}
function updateGamestatus(newgameStatus){
    gamestatus=newgameStatus;
    const gameStatusElement=getGameStatusElement();
    if(gameStatusElement) gameStatusElement.textContent=newgameStatus;
}
function showReplayButton(){
    const replayButton=getReplayButtonElemnt();
    if(replayButton)replayButton.classList.add("show");
}
function hideReplayButton(){
    const replayButton=getReplayButtonElemnt();
    if(replayButton)replayButton.classList.remove("show");
}
function highlightWincell(winPositions){
    if(!Array.isArray(winPositions)||winPositions.length!==3){
        return new Error("invalid win positions");
    }
    for(const positions of winPositions){
        const cell=getCellElementAtIdx(positions);
        if(cell)cell.classList.add("win");
    }
}
function handleCellClick(cell,index){

    const isCurren=cell.classList.contains(TURN.CIRCLE)|| cell.classList.contains(TURN.CROSS);
    const IsEndgame=gamestatus!==GAME_STATUS.PLAYING;
    if(isCurren||IsEndgame) return;
    //set selectors cell
    cell.classList.add(currentTurn);
    // updeta cellValues
    cellValues[index]=currentTurn===TURN.CIRCLE?CELL_VALUE.CIRCLE:CELL_VALUE.CROSS;

    // toggleTurn
    toggleTurn();
  
    // check game status
    const game=checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED:{
            updateGamestatus(game.status);
            showReplayButton();
            break;
        }
        case GAME_STATUS.O_WIN:
        case GAME_STATUS.X_WIN:{
            updateGamestatus(game.status);
            showReplayButton();
            highlightWincell(game.winPositions);
            break;
        }
            
        default: // playing
    }
      console.log('click',cell,index);
}
function initCellElementList(){

    const cellElementList=getCellElementList();
    cellElementList.forEach((cell,index)=>{
        cell.addEventListener('click',()=>handleCellClick(cell,index));
    })
}
function restgame(){
    //reset temp globla vars
    currentTurn=TURN.CROSS;
    gamestatus=GAME_STATUS.PLAYING;
    cellValues=cellValues.map(()=>"");
    //reset dom element
    // reset game status
    updateGamestatus(GAME_STATUS.PLAYING);
    // reset current turm
    const currentTurnElement=getCurrentTurnElement();
    if(currentTurnElement){
        currentTurnElement.classList.remove(TURN.CIRCLE,TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
    // reset game board
    const cellElementList=getCellElementList();
    for(const cellElement of cellElementList){
        cellElement.className='';
    }
    // hide replay button
    hideReplayButton();
}
function initReplayButton(){
    const replayButton=getReplayButtonElemnt();
    if(replayButton){
        replayButton.addEventListener('click',restgame)
    }
}
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
(()=>{
    // bind click event for all li elementt
    initCellElementList();
    // bind click event for replay button
    initReplayButton();
    // .....
})()
