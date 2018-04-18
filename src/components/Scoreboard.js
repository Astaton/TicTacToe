import React from 'react';

function Score(props){
  var pStyle = {
    color: "#05abe5",
    textShadow: "0px 0px 1px #000000, 0px 0px 2px #64c8eb, 0px 0px 4px #86d7f3, 0px 0px 6px #3d3d5c, 1px 1px 2px #FFFFFF",
    margin: '30px 15px',
}
  return(
  <div id="score">
      <p style={pStyle}>
        X: {props.xScore} | O: {props.oScore}
      </p>
  </div>
  )
}

function Turn(props){
  var pStyle = {
    color: "#05abe5",
    textShadow: "0px 0px 1px #000000, 0px 0px 2px #64c8eb, 0px 0px 4px #86d7f3, 0px 0px 6px #3d3d5c, 1px 1px 2px #FFFFFF",
    paddingLeft: "20px",
    margin: '30px 15px',
}
  return(
    <div id="turn">
       <p style={pStyle}>
          {props.winner === 3? "Draw!": props.winner > 0 && props.winner < 3? props.winner == 1 ? "X Wins!" : "O Wins!" : props.player? "X's Turn" : "O's Turn"}
       </p>
    </div>
  )
}


function ScoreBoard(props){
var style={
    scoreBoard: {
    display: "flex",
    textAlign: "center",
    position: "relative",
    marginRight: "auto",
    marginLeft: "auto",
    background: "#3d3d5c",
    },
    contentWrapper: {
      display: "flex",
      marginRight: "auto",
      marginLeft: "auto",
      opacity: ".75",
    }
}
return(
  <div style={style.scoreBoard} id="scoreBoard">
    <div style={style.contentWrapper} id="contentWrapper">  
      <Turn winner = {props.winner} player = {props.player}/>
      <Score xScore={props.xScore} oScore={props.oScore}/>
     </div>
  </div>
);
}

export default ScoreBoard;