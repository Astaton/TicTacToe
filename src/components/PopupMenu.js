import React from 'react';

function MenuButton(props){
  return(
  <button style={props.buttonStyle} onClick={() => props.handleClick(props.data)}>
      {props.buttonText}
  </button>
  )
}

class PopupMenu extends React.Component{
  constructor(props){
    super(props)
      this.state = {
          menuText: "1 Player  |  2 Players",
          button1: "player1",
          button2: "player2",
          gameSettings: {
                ai: null,
                startingPlayerMark: null,
          }
    }
    this.choosePlayersButton = this.choosePlayersButton.bind(this);
    this.choosePlayerMark = this.choosePlayerMark.bind(this);
    this.rejectSettings = this.rejectSettings.bind(this);
  }

  //resets values for buttons 1 and 2 incase PopupMenu is rendered by startover button
  componentWillMount(){
    this.setState({button1: "player1",
                   button2: "player2",})
  }
  
//////////////////// Start functions that generate game settings /////////////////////////////
//both buttons in the game settings menu call the same function (choice) is the data from the buttont that was clicked
//the game settings are stored in an object that is passed along through these functions
//menutext is text displayed in the popupmenu above the buttons
//buttons are stored in an object in the render method, button1 and button 2 are set to keys in the buttons object
  
  choosePlayersButton(choice){
    var tempGameSettings = {
          ai: choice == 1? true : false,
          startingPlayerMark: null,
    }
   this.setMenuForChoosePlayerMark(tempGameSettings);
  }
  

  setMenuForChoosePlayerMark(settings){
    this.setState({
          menuText: "Player 1 choose X or O",
          button1: "chooseX",
          button2: "chooseO",
          gameSettings: settings,
    })
  }
  
  choosePlayerMark(choice){
    var tempSetting = this.state.gameSettings.ai
    var tempGameSettings = {
          ai: tempSetting,
          startingPlayerMark: choice,
    }
    this.setMenuForConfirmSettings(tempGameSettings);
  }
  
  setMenuForConfirmSettings(settings){
    this.setState({
          menuText: settings.ai? settings.startingPlayerMark? "Player X | Comp O?" : "Player O | Comp X?" : settings.startingPlayerMark? "Player 1 X | Player 2 O?" : "Player 1 O | Player 2 X?",
          button1: "accept",
          button2: "reject",
          gameSettings: settings,
    })
  }
  
  rejectSettings(choice){
    // if(choice){
    //   props.startGame("works");
    // }
    this.setState({
      menuText: "1 Player  |  2 Players",
      button1: "player1",
      button2: "player2",
      gameSettings: {
           ai: null,
           startingPlayerMark: null,
          }
    });
  }
  //////////////////// End functions that generate game settings /////////////////////////////
  render(){
    var height = Math.max($(document).height(), $(window).height())
    var hideMenu = this.props.popupMenuVisibility? "visible" : "hidden";
    var style = {
      divInner: {
      backgroundColor: "grey",
      position: "relative",
      top: "230px",
      marginRight: "auto",
      marginLeft: "auto",
      visibility: hideMenu,
      width: "250px",
      height: "180px",
      zIndex: "2",
      paddingTop: "1px",  
    },
      divOutter: {
        position: "absolute",
        visibility: hideMenu,
        top: "0",
        width: "100%",
      },
      background: {
        backgroundColor: "#29252d",
        visibility: hideMenu,
        position: "absolute",
        top: "0",
        opacity: ".75",
        zIndex: "1",
        flex: 1,
        height: height,
        width: document.documentElement.scrollWidth + 'px',
      },
      button1: {
        marginLeft: "25px",
        marginBottom: "15px",
        float: "left",
      },
      button2: {
        marginRight: "25px",
        float: "right",
    },
      pStyle: {
        textAlign: "center",
      }
    }
      const buttons = {
      player1: <MenuButton  buttonStyle={style.button1} data={1} buttonText={"1 \n Player"} handleClick={this.choosePlayersButton}/>,
      player2: <MenuButton  buttonStyle={style.button2} data={2} buttonText={"2 Players"} handleClick={this.choosePlayersButton}/>,
      chooseX: <MenuButton  buttonStyle={style.button1} data={true} buttonText={"X"} handleClick={this.choosePlayerMark}/>,
      chooseO: <MenuButton  buttonStyle={style.button2} data={false} buttonText={"O"} handleClick={this.choosePlayerMark}/>,
      accept: <MenuButton  buttonStyle={style.button1} data={this.state.gameSettings} buttonText={"Start"} handleClick={this.props.startGame}/>,
      reject: <MenuButton  buttonStyle={style.button2} data={false} buttonText={"Reset"} handleClick={this.rejectSettings}/>,
    };
  return(
  <div id="popupMenu">
    <div style={style.background}>
    </div>
    <div style={style.divOutter}>
      <div style={style.divInner}>
          <p style={style.pStyle}>
            {this.state.menuText}
          </p>
          {buttons[this.state.button1]}
          {buttons[this.state.button2]}
      </div>
    </div>
  </div>
  )
  }
}

export default PopupMenu; 