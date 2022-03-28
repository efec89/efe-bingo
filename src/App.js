import './App.css';
import React from "react";
//Library for dynamic references
import useDynamicRefs from 'use-dynamic-refs';
//Library for ripple effect on the square touches
import Ripples from 'react-ripples'
//Library for fireworks
import { Fireworks } from 'fireworks-js/dist/react'
//Click sound
import sound_click from './assets/click.mp3';
//Bingo sound
import sound_bingo from './assets/bingo.mp3';

const _ = require('lodash');

//Words array
let bingo = [
  "(child noises in the background)",
  "Hello, hello?",
  "i need to jump in another call",
  "can everyone go on mute",
  "could you please get closer to the mic",
  "(load painful echo / feedback)",
  "Next slide, please.",
  "can we take this offline?",
  "is ___ on the call?",
  "Could you share this slides afterwards?",
  "can somebody grant presenter rights?",
  "can you email that to everyone?",
  "sorry, i had problems loging in",
  "(animal noises in the background)",
  "Sorry, i didn’t found the conference id",
  "i was having connection issues",
  "i’ll have to get back to you",
  "who just joined?",
  "sorry, somehting ___ with my calenar",
  "do you see my screen?",
  "lets wait for ___!",
  "You will send the minutes?",
  "sorry was on the mute.",
  "can you repeat please?"
]

function App() {
  let [state, setState] = React.useState({viewPort: null});
  let [gameObjects, setGameObjects] = React.useState([]);
  let [fireworks, setFireworks] = React.useState(false);
  let [count, setCount] = React.useState(0);
  let [completed, setCompleted] = React.useState(0);
  let homeDiv = React.useRef(null);
  const [getRef, setRef] =  useDynamicRefs();


  function createGame(){
    console.log("Game Created")
    //Firstly shuffling the words array
    bingo = bingo
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    //Then creating objects and adding to state
    let objects = [];
    for(let i=0; i<bingo.length; i++){
      if(i == 12) {
        //12. Element is free BINGO, always checked
        objects.push({name: "BINGO!", checked: true, correct: false, bingo: true})
      }
      objects.push({name: bingo[i], checked: false, correct: false, bingo: false})
    }
    setGameObjects(objects);
  }

  const clicked  = (num) => {
    //Getting objects from state
    let obj = gameObjects;

    //Change clicked object checked status
    obj[num].checked = !obj[num].checked;

    //Updating the objects in the state
    setGameObjects(obj);
    setGameObjects([...gameObjects]);

    //Playing click sound
    new Audio(sound_click).play();

    //Saving latest completed rows count to state
    setCount(completed);
    //Resetting all completed rows before calculation
    resetCorrect();
    //Checking completed rows
    checkRow();
    //Checking completed columns
    checkColumn();
    //Checking completed crosses
    checkCross();
  }

  React.useEffect(() => {
    //If new completed lines count more than old completed counts, Fireworks will start
    if(completed > count){
      //Playing Bingo sound
      new Audio(sound_bingo).play();
      //Fireworks starts...
      sendFireworks();
      setCount(completed);
    }
  })

  function sendFireworks(){
    //Firework object enabled
    setFireworks(true);

    //After 5.5 seconds fireworks will stop
    setTimeout(function (){
      setFireworks(false);
    }, 5500)
  }

  function resetCorrect(){
    //Firstly getting gameobject array from state
    let obj = gameObjects;
    //For loop for the object elements
    for(let i=0; i<25; i++){
      //Correct values setting to false
      obj[i].correct = false;
    }
    //Completed state changing to 0
    setCompleted(0);
    //Changed gameobject saving to state
    setGameObjects(obj);
    //Setting gameobject for rendering page
    setGameObjects([...gameObjects]);
  }
  function checkRow(){
    //Firstly getting gameobject array from state
    let obj = gameObjects;
    //Checking 5 rows with loop
    for(let i=0; i<5; i++){
      //Firstly completed variable setting true
      let completed = true;
      //Checking columns on selected row with loop
      for(let j=i*5; j<(i*5)+5; j++){
        if(!obj[j].checked){
          //If object on that row and colunn is not checked, completed variable setting false
          completed = false;
        }
      }
      //If completed variable still true...
      if(completed){
        //All row elements correct child setting true
        for(let j=i*5; j<(i*5)+5; j++){
          obj[j].correct = true;
        }
        //Completed state incrementing +1
        setCompleted(completed => completed + 1);
      }
      //Changed gameobject saving to state
      setGameObjects(obj);
      //Setting gameobject for rendering page
      setGameObjects([...gameObjects]);
    }
  }
  function checkColumn(){
    //Firstly getting gameobject array from state
    let obj = gameObjects;
    //Checking 5 columns with loop
    for(let i=0; i<5; i++){
      //Firstly completed variable setting true
      let completed = true;
      //Checking rows on selected row with loop
      for(let j=i; j<(i+21); j+=5){
        if(!obj[j].checked){
          //If object on that column and row is not checked, completed variable setting false
          completed = false;
        }
      }
      //If completed variable still true...
      if(completed){
        //All row elements correct child setting true
        for(let j=i; j<(i+21); j+=5){
          obj[j].correct = true;
        }
        //Completed state incrementing +1
        setCompleted(completed => completed + 1);
      }
    }
    //Changed gameobject saving to state
    setGameObjects(obj);
    //Setting gameobject for rendering page
    setGameObjects([...gameObjects]);
  }
  function checkCross(){
    //Firstly getting gameobject array from state
    let obj = gameObjects;
    //Firstly completed variable setting result
    let completed = true;
    //Checking left to right cross check
    for(let i=0; i<25; i+=6){
      //If object on that column and row is not checked, completed variable setting false
      if(!obj[i].checked){
        completed = false;
      }
    }
    //If completed variable still true...
    if(completed){
      //All row elements correct child setting true
      for(let i=0; i<25; i+=6){
        obj[i].correct = true;
      }
      //Completed state incrementing +1
      setCompleted(completed => completed + 1);
    }

    //Completed variable setting result
    completed = true;
    //Checking right to left cross check
    for(let j=4; j<21; j+=4) {
      //If object on that column and row is not checked, completed variable setting false
      if (!obj[j].checked) {
        completed = false;
      }
    }

    //If completed variable still true...
    if(completed){
      //All row elements correct child setting true
      for(let j=4; j<21; j+=4) {
        obj[j].correct = true;
      }
      //Completed state incrementing +1
      setCompleted(completed => completed + 1);
    }
    //Changed gameobject saving to state
    setGameObjects(obj);
    //Setting gameobject for rendering page
    setGameObjects([...gameObjects]);
  }

  React.useEffect(() => {
    //Creating the game
    createGame();

    //Creating event listeners for windows size changing
    const reportWindowSize = _.throttle(() => {
      setState({viewPort: {width: window.innerWidth, height: window.innerHeight}});
    }, 100);

    reportWindowSize();
    window.addEventListener('resize', reportWindowSize);

    return () => {window.removeEventListener('resize', reportWindowSize);}
  }, []);

  React.useEffect(() => {
    //If windows size is changed
    if (state.viewPort) {
      let n = Math.min(state.viewPort.height, state.viewPort.width);
      //Default padding is 40
      let padding = 40;
      //If screen size lower than 400, padding is 0 for space for texts
      if(n < 400){
        padding = 0;
      }
      //Changing size of the game, when the window size changed
      homeDiv.current.style.height = `${n-padding}px`;
      homeDiv.current.style.width = `${n-padding}px`;

      //For loop for game squares
      for(let i=0; i<gameObjects.length; i++){
        //Getting id of the square
        const id = getRef("square_"+i);
        if(id.current){
          //Square size changing for the window
          id.current.style.height = `${(n-padding)/5}px`;
          id.current.style.width = `${(n-padding)/5}px`;

          //Font size changing for the window
          let font_size = Math.max(Math.floor(n/60),10);
          id.current.style.fontSize = font_size+'px';
        }
      }
    }
  });

  return (
      <div className="Main">
        <div className="App" ref={homeDiv}>
            {
              gameObjects.map((item, i) => {
                let itemClass = "Square";
                if(item.bingo){
                  itemClass = "Square Bingo";
                }else{
                  if(item.correct){
                    itemClass = "Square Correct";
                  }else if(item.checked){
                    itemClass = "Square Selected";
                  }
                }
                return (
                  <Ripples key={i}>
                    <button className={itemClass} disabled={item.bingo?true:false} ref={setRef("square_" + i)} onClick={(event) => clicked(i)}>
                      {i == 12?
                          ""
                          :
                          item.name
                      }
                      <p className="SquareNumber">{i}</p>
                    </button>
                  </Ripples>
                );
              })
            }
          </div>
        {fireworks ?
            <Fireworks
                enabled={fireworks}
                options={{
                  speed: 3,
                  explosion: 6,
                  sound: {
                    enabled: true,
                    files: [
                      'https://falvakti.net/bingo/firework.mp3',
                    ],
                    volume: {
                      min: 90,
                      max: 100
                    }
                  },
                }}
                style={{
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  position: 'absolute'
                }}/>
            :
            <div/>
        }
      </div>
  );
}

export default App;
