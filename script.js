//board
let board;
let boardWidth= 750;
let boardHeight = 250;
let context;

//guinea pig
let pigWidth = 90;
let pigHeight = 70;
let pigX = 50;
let pigY = boardHeight - pigHeight;
let pigImg;

let pig ={
    x: pigX,
    y: pigY,
    width: pigWidth,
    height: pigHeight

}
//obstacle array
let obsArray = [];

//orange 
let orangeX = 700;
let orangeWidth = 50;
let orangeHeight = 50;
let orangeY = boardHeight - orangeHeight;

let orangeImg;

//barrel

let barrelWidth = 35;
let barrelHeight = 60;
let barrelX = 700;
let barrelY = boardHeight - barrelHeight;

let barrelImg;



//physics 
let velocityX = -8; //obs moving left speed
let velocityY = 0; //for jumping
let gravity = 0.4;
let  velocityXPig = 0;


let gameOver = false;
let score = 0;

//extra variables
let end = false;
window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;

    context = board.getContext("2d");

    

    pigImg = new Image();
    pigImg.src ="./images/guineapig.png";
    pigImg.onload = function () {
        context.drawImage(pigImg,pig.x,pig.y,pig.width,pig.height);
    }

    orangeImg = new Image();
    orangeImg.src = "./images/orange.png";
   

    barrelImg = new Image();
    barrelImg.src = "./images/woodbarrel.png";
    

 
requestAnimationFrame(update);
setInterval(placeObs,1000); // every 1 second with generate obstable
document.addEventListener("keydown", movePigUp);


}


//guinea pig will be drawn over and over again 
function update() {
    
    if (score > 1000 ){
        requestAnimationFrame(update2);
     }
     else {
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
   // context.fillStyle = "green";
    //context.fillRect(50, 50, pig.width, pig.height); 
    context.clearRect(0,0,board.width,board.height);
    
    velocityY +=gravity;
    pig.y = Math.min(pig.y +velocityY, pigY); //make sure it doesnt exceed the ground
    context.drawImage(pigImg,pig.x,pig.y,pig.width,pig.height);
    

    //loop through obsArray to place obstacles
   
    for (let i =0; i < obsArray.length; i++) {
        let obstacle = obsArray[i];
        obstacle.x += velocityX;
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        if (detectHit(pig,obstacle)){
            gameOver = true;
        }
        context.fillStyle = "black";
        context.font = "20px courier";
        score++;
        context.fillText(score,5,20);
        
       
    }

     }
  //score
 
}

function update2() {
    requestAnimationFrame(update2);
    context.clearRect(0,0,board.width,board.height);
    pig.x = pig.x + velocityXPig;
    context.drawImage(pigImg,pig.x,pig.y,pig.width,pig.height);
    pig.x = pig.x;
    let score2 = score;
    context.fillText(score2,5,20);
}





function movePigUp(e) {
    if(gameOver){
        return;
    }
    if ((e.code == "Space" || e.code == "ArrowUp")&& pig.y == pigY){
        //jump
        velocityY = -10
 
    }
    if ( e.code =="ArrowRight" || e.code =="KeyD"){
        // find out pigs coords and then plus or minus and remember to consider canvas side
        if (pig.x >=45 && pig.x <=700){
            velocityXPig +=1;
            console.log(velocityXPig +"pig.x"+pig.x);
        }
        

    }

    else if (e.code =="ArrowLeft" ||e.code == "KeyA") {

            if( pig.x >=50 && pig.x <=650){
            velocityXPig -=1;
            console.log(velocityXPig +"pig.x"+pig.x);
            }
        
    }
}


function placeObs() {

    let orange = {
        x : orangeX,
        y : orangeY,
        width : orangeWidth,
        height : orangeHeight,
        img : orangeImg
    }

    let barrel = {
        x : barrelX,
        y : barrelY,
        width : barrelWidth,
        height : barrelHeight,
        img : barrelImg
    }
   
 if(gameOver){
        return;
    }
let obsChance = Math.random();
if(score<1000){
if (obsChance > .50){
    obsArray.push(orange);
}

if(obsChance < .50){
    obsArray.push(barrel); 
}
}
//make sure array does not constantly grow 
if(obsArray.length > 5) {
    obsArray.shift(); // removes first element from array
}

}

function detectHit (a,b) {
return a.x <b.x + b.width && // a's top left corner doesnt reach b's top right corner
    a.x + a.width > b.x && // a's top right corner passes b's top left corner
    a.y <b.y +b.height && // a's top left corner doesnt reach b's bottom left corner
    a.y + a.height > b.y; // a's bottom left corner passes b's top left corner
}