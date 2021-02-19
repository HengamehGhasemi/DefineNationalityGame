var rightTop,leftTop,rightDown,leftDown,playAgain;
var myObstacles = [];
var Score ;
var image ;
//array of firstname of nationality
var countrySymbol= ["c","j","k","t"]
//array for save the src of each picture
var picNames = []
//number of all pictures
var numberOfPictures = 20
var gameIsRuning = true
var changeImage = false

function startGame() {
    //4 box for select nationality
    rightTop = new boxComponent(80, 80, "red", 400, 0,"Japanese");
    leftTop = new boxComponent(80, 80, "red", 400, 400 ,"Chinese");
    rightDown = new boxComponent(80, 80, "red", 0, 0,"Korean");
    leftDown = new boxComponent(80, 80, "red", 0, 400,"Thai");
    playAgain = new boxComponent(80, 80, "green", 210, 270);
    //a new component for show score
    Score = new ScoreComponent("15px", "Consolas", "black", 125, 470);
    //an image component for show my people picture
    image = new ImageComponent(80, 80, "pictures/c0.jpg", 200, 0);
    //insert picture Names
    insertPicture()
    myGameArea.start();
}
function insertPicture(){
        for(i=0 ; i<=3 ; i++){
            for(j=0 ; j<=4 ; j++){
                picNames.push("pictures/"+countrySymbol[i]+j+".jpg")
         }
    }
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        console.log("game start2")
        //Create the Base Context
        this.canvas.width = 480;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        //Tap Listener
        window.addEventListener('mousedown', function (e) {
            console.log("c1")
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
        //Click Listener
        window.addEventListener('touchstart', function (e) {
            console.log("c3")
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
      }
}


function boxComponent(width, height, color, x, y, name) {
    this.name = name;
    this.score = 0;
    this.width = width;
    this.height = height;    
    this.x = x;
    this.y = y;
    this.clicked = false
    this.update = function() {
            ctx = myGameArea.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = "black"
            ctx.font = "10pt sans-serif";
            ctx.fillText(this.name,this.x+40, this.y+40);
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
    }
    this.clicked = function() {
        //check which box has been clicked
        if ((this.y + (this.height) <= myGameArea.y) || (this.y >= myGameArea.y) || (this.x + (this.width) <= myGameArea.x) || (this.x >= myGameArea.x)) {
          return false;
        }
        return true;
    } 
    this.hidden = function(){
        this.name = ""
        this.width = 0
        this.height = 0
    }
    this.show = function(){
        this.name = "playAgain"
        this.width = 80
        this.height = 80
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black"
        ctx.font = "10pt sans-serif";
        ctx.fillText(this.name,this.x+40, this.y+40);
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
    }
}

function ScoreComponent(textSize, font, color, x, y) {
    this.score = 0;
    this.textSize = textSize;
    this.font = font;    
    this.x = x;
    this.y = y;
    this.update = function(text) {
            ctx = myGameArea.context;
            ctx.font = this.textSize + " " + this.font;
            ctx.fillStyle = color;
            ctx.fillText("Score :"+text, this.x, this.y);
    }
    this.finish = function() {
       this.x = 245
       this.y = 240
    },
    this.reset = function() {
        this.score = 0
        this.x = 125
        this.y = 470
    }
}

function ImageComponent(width, height, src, x, y) {
    this.image = new Image();
    this.image.src = src;
    this.name = src
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.02;
    this.bounce = 0.1;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    //if picture hit the bottom of convas
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            if(picNames.length > 0){
                Score.score = Score.score - 5
                this.bounce
                this.y = 0
                this.x = 200
                this.gravity = 0.02
                this.gravitySpeed = 0;
                var randomNumber = getRandomInt(numberOfPictures)
                this.image.src = picNames[randomNumber]
                this.name = picNames[randomNumber]
                picNames.splice(randomNumber,1)
                numberOfPictures -= 1
            }
       }
    }
    //change the picture
    this.changeTheSrc = function(){
        if(picNames.length > 0){
        var randomNumber = getRandomInt(numberOfPictures)
        this.image.src = picNames[randomNumber]
        this.name = picNames[randomNumber]
        console.log("change")
        console.log(picNames)
        picNames.splice(randomNumber,1)
        Score.score  = Score.score + 20
        numberOfPictures -= 1
        this.y = 0
        this.x = 200
        this.gravity = 0.02
        this.gravitySpeed = 0;
        changeImage = true
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function updateGameArea() {

    if (myGameArea.x && myGameArea.y) {

       

        //end of Game
        if(picNames.length <= 0 ){
            console.log("end of game")
            gameIsRuning = false
            playAgain.update()
            playAgain.show()
            Score.finish()

            if(playAgain.clicked()){
                gameIsRuning = false
                insertPicture()
                numberOfPictures = 20
                Score.reset()
                console.log(picNames)
            }
        }
        
      
        else if(image.name){
            var name =  image.name.split("/").pop().replace(".jpg", "")
            if (rightTop.clicked() && name && name.includes("j") 
                ||leftTop.clicked() && name && name.includes("c")
                ||rightDown.clicked() && name  && name.includes("k") 
                ||leftDown.clicked() && name && name.includes("t"))  { 
                   if(changeImage){ 
                    changeImage = false
                    image.changeTheSrc()
                }
            }
        }   
    }

    myGameArea.clear()
    if(!gameIsRuning){
        playAgain.update()
        playAgain.hidden()
        gameIsRuning = true
    }else if(!gameIsRuning){
        playAgain.update()
        playAgain.show()
    }
    myGameArea.frameNo += 1
    Score.update(Score.score)
    rightTop.update();
    leftTop.update();
    rightDown.update()
    leftDown.update()
    if(picNames.length > 0){
    image.update();
    image.newPos();
    }
}



