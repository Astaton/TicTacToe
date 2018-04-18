import React from 'react';
import $ from 'jquery';
import ScoreBoard from './Scoreboard';
import GameBoard from './GameBoard';
import PopupMenu from './PopupMenu'


class Game extends React.Component{
  constructor(props){
    super(props)
    var squares = new Array(9).fill(0)
    this.state = {
      squares: squares,
      squaresAnimated: [],
      xScore: 0,
      oScore: 0,
      winner: 0,
      ai: null,
      player: true, //current player true == player x, false == player o
      startingPlayer: null, //records who started the current game to alternate for the next game
      playerOneMark: null, //true for x, false for o
      popupMenu: true, // toggles the popupMenu
      renderPopupMenu: true,
    }
    this.clickSquare = this.clickSquare.bind(this)
    this.resetBoard = this.resetBoard.bind(this)
    this.resetScore = this.resetScore.bind(this)
    this.startGame = this.startGame.bind(this)
    this.startOver = this.startOver.bind(this)
    this.runAi = this.runAi.bind(this)
  }
  
  //////////////////////////  ai functions start  ///////////////////////////

  componentDidUpdate(){  //checks to see if ai is active and if so calls it to select a square
    let svgPaths = this.state.playerOneMark? "squareO" : "squareX";
    if(this.state.ai === true && this.state.playerOneMark !== this.state.player){
      this.runAi(svgPaths)
    }
  }
  
  runAi(svgPaths){
    
    if(this.terminalStateCheck(this.state.squares) !== null){
      return 
    }
    let aiCalculations = this.startMinmax(); //Initial call to start minimax returns square number.
    let aiChoice = true  
    setTimeout(()=>{this.clickSquare(aiCalculations, parseInt(aiCalculations)+svgPaths, aiChoice)}, 1300); //timeout is to give a pause between human and computer turn
  }
  
  //determines the value for potential moves passed to it from minimax
  utilityCheck(potentialBoard, depth){
    let terminalValue = this.terminalStateCheck(potentialBoard);
    if(terminalValue === "draw" || terminalValue === null){
     let utility = terminalValue === "draw"? 0 : null;
      return utility
    } else{
       let utility = terminalValue?  (10 - depth) : (depth - 10);
      return utility
    }
  }
  
  //uses recursion to simulate all potential moves
  minimax(potentialBoard, aiTurnCheck, depth){
    let win = this.utilityCheck(potentialBoard, depth);
    if(win !== null){
      return {value: win};
    }
    let nextPlayer = aiTurnCheck? false : true;
    let potentialMoves =[];
    for(let i = 0; i < potentialBoard.length; i++){
      let potentialMove = {};
      let nextBoard = [...potentialBoard];
      if(nextBoard[i] === 0){
        potentialMove.position = [i]
        nextBoard[i] = aiTurnCheck;
          let result = this.minimax(nextBoard, nextPlayer, depth+1);
          potentialMove.value = result.value;
        potentialMoves.push(potentialMove);
      }
    }
    var bestResult;
    if(depth === 0){
      let best = {value: -1000, position:null};
      potentialMoves.forEach((result)=>{
        if(best.value < result.value){
          best.value = result.value;
          best.position = result.position;
        }
      })
      return best
    } else{
      if(aiTurnCheck === true){
        let bestValue = -1000;
        for(let i = 0; i < potentialMoves.length; i++){
          if(potentialMoves[i].value > bestValue){
            bestValue = potentialMoves[i].value;
            bestResult = i;
          }
        }
      } else {
        let bestValue = 1000;
        for(let i = 0; i < potentialMoves.length; i++){
          if(potentialMoves[i].value < bestValue){
            bestValue = potentialMoves[i].value;
            bestResult = i;
          }
        }
      }
      return potentialMoves[bestResult];
    }
  }
  
startMinmax(){
    let board = [...this.state.squares];
    let move = this.minimax(board, true, 0).position;
    return move;
  }

  /////////////////  ai functions stop//////////////////////////////
  
  startGame(gameSettings){
    this.setState({ai: gameSettings.ai, player: gameSettings.startingPlayerMark, startingPlayer: gameSettings.startingPlayerMark, popupMenu: false, renderPopupMenu: false, playerOneMark: gameSettings.startingPlayerMark});
    this.resetScore();
    this.resetBoard();
  }
  
  startOver(){
    this.setState({popupMenu: true, renderPopupMenu: true});
  }
  
  removeSquareAnimations(){
    var tempSquaresAnimated = [...this.state.squaresAnimated];
    tempSquaresAnimated.forEach( (path)=> {
      let element = path.element;
      element.classList.remove(path.class);
    });
  }
  
  resetScore(){
    this.setState({xScore:0, oScore:0})
  }
  
  resetBoard(){
    this.replaceGlassPane();
    var resetSquares = new Array(9).fill(0);
    this.removeSquareAnimations();
    if(this.state.winner>0){
    this.setState({squares:resetSquares, player: this.state.startingPlayer? false: true, winner: 0, squaresAnimated: [], startingPlayer: this.state.startingPlayer? false : true});
    }else{
      this.setState({squares:resetSquares, player: this.state.startingPlayer? true: false, winner: 0, squaresAnimated: []});
    }
  }
  
  //checks the board to see if the game is over win lose or draw
  terminalStateCheck(boardArray){
    const checks = [{one: 0, two: 1, three: 2},{one: 3, two: 4, three: 5},{one: 6, two: 7, three: 8},{one: 0, two: 3, three: 6},{one: 1, two: 4, three: 7},{one: 2, two: 5, three: 8},{one: 0, two: 4, three: 8},{one: 6, two: 4, three: 2}];
    for (let i=0; i<checks.length; i++){
    if(boardArray[checks[i].one] === true && boardArray[checks[i].two] === true && boardArray[checks[i].three] === true){
        return true;
        }
    else if(boardArray[checks[i].one] === false && boardArray[checks[i].two] === false && boardArray[checks[i].three] === false){
        return false;
        }
    }
    for(let i = 0; i<boardArray.length; i++){
      if(boardArray[i]===0){
        return null;
      }
    }
    return "draw"
  }
  
  markChoosenSquare(squareSvgPaths){
    var tempSquaresAnimated = [...this.state.squaresAnimated];
    this.calculateColorChange(squareSvgPaths)
    var classToAdd = this.state.player? "squareXAnim" : "squareOAnim";
  for(let i = 0; i<4; i++){ 
    let element = document.getElementById(squareSvgPaths + i);
    tempSquaresAnimated.push({element:element, class: classToAdd});
    element.classList.add(classToAdd);
  } 
    this.setState({squaresAnimated:tempSquaresAnimated});
  }
  
  //removes streaked glass pane hover effect from selected squares
  removeGlassPane(squareId){
    $(squareId).removeClass("glassPane");
    $(squareId).addClass("noGlassPane");
  }

  //replaces streaked glass pane hover effect on all squares
  replaceGlassPane(){
  for(let i = 0; i < this.state.squares.length; i++){
      if(this.state.squares[i] !== 0){
        let glassPaneId = "#"+i+"glassPane";
        $(glassPaneId).removeClass("noGlassPane");
        $(glassPaneId).addClass("glassPane");
      }
    }
  }
  
  calculateColorChange(squareClass){
  var currentColor = {red: 80, green: 131, blue: 27};
  var newColor = this.state.player? {red: 228, green: 45, blue: 111} : {red: 27, green: 100, blue: 125};
  var colorDifference = {red: (currentColor.red - newColor.red)/-30, green: (currentColor.green - newColor.green)/-30, blue: (currentColor.blue - newColor.blue)/-30};
  this.changeColor(currentColor,colorDifference,squareClass);
}
  
  changeColor(strokeColor, incrementColor, squareClass){
  var counter = 0;
  var intervalID = setInterval(function(){
    strokeColor = {red: strokeColor.red + incrementColor.red, green: strokeColor.green + incrementColor.green, blue: strokeColor.blue + incrementColor.blue};
    var svgPieces = document.getElementsByClassName(squareClass)
    for(let i=0; i<svgPieces.length; i++){
      svgPieces[i].style.stroke = "rgb("+parseInt(strokeColor.red)+", "+parseInt(strokeColor.green)+", "+parseInt(strokeColor.blue)+")";
    }
    counter++
    if(counter>=30){
      clearInterval(intervalID);
    }
  }, 25);
  return
}
  
  clickSquare(squareNo, squareSvgPaths, aiChoice){
    if(this.state.ai === true && this.state.playerOneMark !== this.state.player && aiChoice === false){
      return
    }
    let tempSquares = [...this.state.squares];
    if(tempSquares[squareNo] !== 0 || this.state.winner > 0){
      return
    }
    tempSquares[squareNo] = this.state.player;
    this.markChoosenSquare(squareSvgPaths);
    this.removeGlassPane("#"+squareNo+"glassPane");
    if(this.terminalStateCheck(tempSquares) !== null && this.terminalStateCheck(tempSquares) !== "draw"){
      this.setState({ winner: this.state.player? 1 : 2, squares:tempSquares});
      this.setState(prevState => { 
      return this.state.player? {xScore: prevState.xScore + 1} : {oScore: prevState.oScore + 1};
      });
    }else if(this.terminalStateCheck(tempSquares) === "draw"){
      this.setState({ winner: 3, squares:tempSquares});      
    }else{
    this.setState({ player: this.state.player? false : true, squares:tempSquares});
    }
  }
  
  render(){
    return(
    <div>
        <ScoreBoard xScore={this.state.xScore} oScore={this.state.oScore} winner={this.state.winner} player={this.state.player}/>
        <GameBoard clickSquare={this.clickSquare} player={this.state.player} squares={this.state.squares} />
        {this.state.renderPopupMenu? <PopupMenu popupMenuVisibility={this.state.popupMenu} startGame={this.startGame}/> : null}
        <div id="baseButtonsDiv">
          <button className="baseButtons" onClick={this.resetBoard}> 
              Reset Board
          </button>
          <button className="baseButtons" onClick={this.resetScore}> 
              Reset Score
          </button>
          <button className="baseButtons" onClick={this.startOver}> 
              Start Over
          </button>
        </div>
    </div>
    )
  }
}

export default Game;