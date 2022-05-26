const canvas = document.getElementById("pong");

const ctx = canvas.getContext('2d');

var doAnim = true;

const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

const ball2 = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : -2,
    velocityY : 2,
    speed : 2,
    color : "WHITE"
}

const bonusBall = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 20,
    velocityX : 2,
    velocityY : 2,
    speed : 1,
    color : "#F0BE08"
}

const user = {
    x : 0, 
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

const com = {
    x : canvas.width - 10, 
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

function resetBall(b){
    b.x = canvas.width/2;
    b.y = canvas.height/2;
    b.velocityX = -b.velocityX;
    b.speed = 5;
}

function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(text,x,y,size){
    ctx.fillStyle = "#FFF";
    ctx.font = size + " fantasy";
    ctx.fillText(text, x, y);
}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}


function update(b){
    if( b.x - b.radius < 0 ){
        com.score++;
        resetBall(b);
    }else if( b.x + b.radius > canvas.width){
        user.score++;
        resetBall(b);
    }

    b.x += b.velocityX;
    b.y += b.velocityY;
    
    com.y += ((b.y - (com.y + com.height/2)))*0.1;
    
    if(b.y - b.radius < 0 || b.y + b.radius > canvas.height){
        b.velocityY = -b.velocityY;
    }
    
    let player = (b.x + b.radius < canvas.width/2) ? user : com;
    
    if(collision(b,player)){

        let collidePoint = (b.y - (player.y + player.height/2));

        collidePoint = collidePoint / (player.height/2);
        
        
        let angleRad = (Math.PI/4) * collidePoint;

        let direction = (b.x + b.radius < canvas.width/2) ? 1 : -1;
        b.velocityX = direction * b.speed * Math.cos(angleRad);
        b.velocityY = b.speed * Math.sin(angleRad);

        b.speed += 0.1;

        if (b.color === "#F0BE08"){
            player.score += 5;
        }
        if(user.score>=100 || com.score>=100){
            doAnim = false;
        }
    }
   
}


function render(){
    
    make_base();
    
    drawText(user.score,canvas.width/4,canvas.height/5,"75px");

    drawText(com.score,3*canvas.width/4,canvas.height/5,"75px");

    drawNet();
    
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    drawArc(ball.x, ball.y, ball.radius, ball.color);
    drawArc(ball2.x, ball2.y, ball2.radius, ball2.color); 
    if (user.score > 10 || com.score > 10){
        
        drawArc(bonusBall.x, bonusBall.y, bonusBall.radius, bonusBall.color); 
    }
}

function make_base()
{
  base_image = new Image();
  base_image.src = 'https://wallpapercave.com/wp/wp1961390.png';
  ctx.drawImage(base_image, 0, 0);
}

function game(){
    if (!doAnim){
        doAnim=false;
        ctx = null;
        return;
    }
    update(ball);
    update(ball2);
    if (user.score > 10 || com.score > 10){
        update(bonusBall);
    }
    render();
}

let framePerSecond = 50;
let loop = setInterval(game,1000/framePerSecond);