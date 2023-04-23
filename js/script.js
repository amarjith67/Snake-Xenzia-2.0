let canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */  //important
let ctx = canvas.getContext("2d")

const canvasSize = 600;
canvas.height = canvasSize
canvas.width  = canvasSize
canvas.setAttribute('tabindex','0');
canvas.focus()
// canvas.background = "grey"
let isPaused = false;

let level = 250;
let game;
const snakeBox = 20
const totalMoves = canvasSize/snakeBox;

const apple = new Image()
apple.src = "../images/apple.png"

//audio
let lvl=0;
let dead = new Audio()
let up = new Audio()
let down = new Audio()
let left = new Audio()
let right = new Audio()
let eat = new Audio()

dead.src = "../audio/dead.mp3"
eat.src = "../audio/eat.mp3"
up.src = "../audio/up.mp3"
down.src = "../audio/down.mp3"
left.src = "../audio/left.mp3"
right.src = "../audio/right.mp3"

// snake definition
let snake = []
snake[0] ={
    x: 10* snakeBox,
    y:  9* snakeBox
}
//create food
let food ={}
getFood()

//score
let score = 0
init()

let highScore = 0

// direction
let dir =""
canvas.addEventListener("keydown",(event)=>{
    // if(event.key="Space") console.log("hii",event.key)
 


 if (event.key== "ArrowLeft" && dir!="ArrowRight"){
    dir = "ArrowLeft"
    left.play()
 }
 else if (event.key == "ArrowUp" && dir!=="ArrowDown"){
    dir = "ArrowUp"
    up.play()
 }
 else if (event.key == "ArrowRight" && dir!=="ArrowLeft"){
    dir = "ArrowRight"
    right.play()
 }
 else if (event.key == "ArrowDown" && dir!="ArrowUp"){
    dir = "ArrowDown"
    down.play()
 }  
 //pause logic
 else if(event.key =="p" && isPaused == false){
    isPaused = true 
} 
 else if(event.key=="p" && isPaused == true){
    isPaused = false
  
  }
})

function snakeCollison(head,ar){
    ar.forEach((item) => {
        if(head.x == item.x && head.y == item.y){
           gameOver();
        }
    })
}
function getFood(){
    food = {
        x : Math.floor(Math.random()* (totalMoves - 2-3) + 3)*snakeBox,
        y: Math.floor(Math.random()* (totalMoves -2-3) + 3) *snakeBox 
    }
}

function render(){
    ctx.fillStyle = "rgb(20,20,20)"
    ctx.fillRect(0,0,canvasSize,canvasSize)

   snake.forEach((item,i)=>{
    ctx.fillStyle = i == 0? "#4CAF50": "brown"
    ctx.fillRect(item.x,item.y,snakeBox,snakeBox)
    ctx.strokeStyle = i == 0? "black" : "black"
    ctx.strokeRect(item.x,item.y,snakeBox,snakeBox)
   })

   ctx.drawImage(apple,food.x,food.y,snakeBox,snakeBox)

   let snakeX = snake[0].x
   let snakeY = snake[0].y
   
   if(!isPaused){
   if(dir=="ArrowLeft") snakeX -= snakeBox;
   if(dir == "ArrowRight") snakeX += snakeBox;
   if(dir == "ArrowUp") snakeY -= snakeBox;
   if(dir == "ArrowDown") snakeY += snakeBox;

   //if snake eat food
   if(snakeX == food.x && snakeY == food.y ){
    score++;
    eat.play()
    getFood()
   }
   else{
    snake.pop()
   }
  
   let newHead = {
    x : snakeX,
    y : snakeY,
   }
  
   //level
   levels(score);
//   console.log(lvl)
   
  

  if(snakeX<0 || snakeY<0 || snakeX>=canvasSize || snakeY>=canvasSize){
    gameOver();
    return;
  }
  snakeCollison(newHead,snake);
  
  snake.unshift(newHead)
  
  ctx.fillStyle = "red"
  ctx.font = "40px tahoma"
  ctx.fillText(score,10,40)

  //level indicator
  let levelText = lvl>0? `LEVEL: ${lvl}`:"LEVEL: 0"
  ctx.fillStyle = "yellow"
  ctx.font ="35px tahoma"
  ctx.fillText(levelText,canvasSize-170,40)

  // hs indicator
  highscore(score);
  ctx.fillStyle = "green"
  ctx.font ="35px tahoma"
  ctx.fillText(`HSCORE: ${localStorage.getItem("score")}`,canvasSize-430,40)
}
}

let prev_score = 0
function levels(score){
    clearInterval(game)
    if (score>0 && score!=prev_score ){
        if(score%3 == 0 && level>100){
            level-=50
            lvl++;
            prev_score = score
            console.log(level)
        }
    }

    //reinitialising the interval with new level values
    game =  setInterval(render,level)

}

game = setInterval(render,level);

//localStorage initialisation
function init(){
    if(localStorage.getItem("score") === null){
        localStorage.setItem("score",0);
    }
}

// highscore logic
function highscore(score){
    let old_score = localStorage.getItem("score");
    if (score>old_score){
        localStorage.setItem("score",score)
    }
}



function gameOver(){
    clearInterval(game);
    dead.play();
    ctx.fillStyle = "white"
    ctx.font ="40px tahoma"
    ctx.fillText("Game Over!",canvasSize/2-100,canvasSize/2)
}

