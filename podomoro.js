//get all needed DOM elements
const sessionLength = document.getElementById('session-length');
const breakLength = document.getElementById('break-length');
const breakInc = document.getElementById('break-increment');
const breakDec = document.getElementById('break-decrement');
const sessionInc = document.getElementById('session-increment');
const sessionDec = document.getElementById('session-decrement');
const start_stop = document.getElementById('start_stop');
const reset = document.getElementById('reset');
const timeLeft = document.getElementById('time-left');
const timerLabel = document.getElementById('timer-label');
const audio = document.getElementById('beep');

//add listeners to clickable elements
breakInc.addEventListener('click', addLength);
breakDec.addEventListener('click', decLength);
sessionInc.addEventListener('click', addLength);
sessionDec.addEventListener('click', decLength);
start_stop.addEventListener('click', startStop);
reset.addEventListener('click', resetTimer);

let sessionTimer = parseInt(sessionLength.innerHTML) * 60;  //convert to seconds
let breakTimer = parseInt(breakLength.innerHTML) * 60;  //convert to seconds

//functions
function addLength(e){
    e.preventDefault();
    if(e.target.id == "break-increment"){
        let breakTime = parseInt(breakLength.innerHTML);
        if(breakTime < 60){ //upper bound
            breakTime += 1;
            breakTimer = breakTime * 60;
        }
        breakLength.innerHTML = breakTime;
    }
    else if(e.target.id == "session-increment"){
        let sessionTime = parseInt(sessionLength.innerHTML);
        if(sessionTime < 60){ //upper bound
            sessionTime += 1;
            sessionTimer = sessionTime * 60;
            timeLeft.innerHTML = sessionTime.pad() + ":00";
        }
        sessionLength.innerHTML = sessionTime;
    }
}

function decLength(e){
    e.preventDefault();
    if(e.target.id == "break-decrement"){
        let breakTime = parseInt(breakLength.innerHTML)
        if(breakTime > 1){ //prevent negative time
            breakTime-=1;
            breakTimer = breakTime * 60;
        }
        breakLength.innerHTML = breakTime;
    }
    else if(e.target.id == "session-decrement"){
        let sessionTime = parseInt(sessionLength.innerHTML);
        if(sessionTime > 1){ //prevent negative time
            sessionTime-=1;
            sessionTimer = sessionTime * 60;
            timeLeft.innerHTML = sessionTime.pad() + ":00";
        }
        sessionLength.innerHTML = sessionTime;
    }
}

//makes sure there is leading zeroes when min or sec is less than 10 (i.e. 9 wrong, 09 correct)
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

let timerPaused = true;


function startStop(e){
    e.preventDefault();
    if(e.target.innerHTML =="Start"){
        e.target.innerHTML = "Pause";
        timerPaused=false;
    }   
    else{
        timerLabel.innerHTML = "Session Paused";
        timerPaused = true;
        e.target.innerHTML = "Start";
    }
}

function resetTimer(){
    timerPaused =true;
    timerLabel.innerHTML = "Session Timer";
    audio.currentTime = 0;
    sessionLength.innerHTML = 25;
    breakLength.innerHTML=5;
    timeLeft.innerHTML = parseInt(sessionLength.innerHTML).pad() + ":00";
    sessionTimer = parseInt(sessionLength.innerHTML) * 60;
    breakTimer = parseInt(breakLength.innerHTML) * 60;
}

const timer = setInterval(function(){ 
    if(!timerPaused){
        if(sessionTimer>0){
            timerLabel.innerHTML = "Currently in Session";
            var m = Math.floor(sessionTimer / 60).pad();
            var s = (sessionTimer % 60).pad();
            timeLeft.innerHTML = m+ ":"+ s; 
            sessionTimer--;
        }
        else{
            if(sessionTimer > -2){
                audio.play();
                sessionTimer--;
            }
            else if(breakTimer>0){
                timerLabel.innerHTML = "Currently in Break";
                var m = Math.floor(breakTimer / 60).pad();
                var s = (breakTimer % 60).pad();
                timeLeft.innerHTML = m+ ":"+ s; 
                breakTimer--;
            }
            else if(breakTimer==0){
                audio.play();
                sessionTimer = parseInt(sessionLength.innerHTML) * 60;
                breakTimer = parseInt(breakLength.innerHTML) * 60;
            }
        }
    }

}, 1000);  
