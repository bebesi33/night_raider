
stats: {
    warnings: false
}

var canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = "blue";
ctx.fillRect(0, 0, canvas.width, canvas.height);



const TILE_SIZE=32;
const C_WIDTH=canvas.width;
const C_HEIGHT=canvas.height;
canvas.width=window.innerWidth-30;
canvas.height=window.innerHeight-30;
var mapStyle;

var index;
game_Camera=new Camera(C_WIDTH,C_HEIGHT );
const deltaTime=1/60;
let accumulatedTime;
let lastTime;
var scene = new fw.Scene();
var game_Manager=new fw.Game_Manager();
var mouse_X=0;
var mouse_Y=0;


function initialize(lvl){
    game_Camera=new Camera(C_WIDTH,C_HEIGHT );
    scene = new fw.Scene();
    accumulatedTime=0;
    lastTime=0;
    levelManager(scene,lvl);
}

function render(){
    if(game_Manager.state=="In Game"){
        index = fw.createIndex(scene);
        scene.fire('update');
        ctx.clearRect(0,0,canvas.width,canvas.height);
        scene.fire('draw', ctx);
    }
    game_Manager.refresh();//csak update van itt, ami rajzol is
}

function loop(time){   
   accumulatedTime=Math.min(0.5,accumulatedTime + (time - lastTime)/1000); 
   while(accumulatedTime>deltaTime){
            render();
            accumulatedTime-=deltaTime;   
    }//időzítés korrekciók
    //decoupling game frame rate from rendering framerate 
    lastTime = time;     
    requestAnimationFrame(loop); 
}

// event functions
const pressedKeys = new Set();
document.body.addEventListener('keydown', function(event){
    pressedKeys.add(event.which);
});

document.body.addEventListener('keyup', function(event){
    pressedKeys.delete(event.which);
});


document.body.addEventListener('click', function(event){
    mouse_X=event.pageX-canvas.offsetLeft;
    mouse_Y=event.pageY-canvas.offsetTop;
});//le se tárolom, csak a legutolsó kattintás poziját.




// első futás...//
initialize(game_Manager.return_map());
requestAnimationFrame(loop);
