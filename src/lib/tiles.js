
var platforms = {};

class Tile extends fw.EntityWithSprite {
    constructor(x, y) {
        super(x, y);
        this.image =Tile.image;
        this.posX=1;
        this.posY=1;
        this.type=0;
        this.soft=0;
    }

    /*
    type=1 -> moon
    type=2 -> stars A
    type=3 -> stars C
    type=4 -> stars D  
    type=5yx -> ground position y and x
    */

    draw(ctx) {
        if (!this.image) {
            return;
        }
    }

    getLeft() {
        return this.soft ? -100 : this.x;
    }

    getTop() {
        return this.soft ? -100 : this.y;
    }

    getWidth() {
        return TILE_SIZE-1;
    }

    getHeight() {
        return TILE_SIZE-1;
    }

} 

class Moon extends Tile{
    constructor(x, y) {
        super(x, y);
        this.image = Tile.image;
        this.posX=4;
        this.poY=1;
        this.type=1;
        this.soft=1;
    }
    draw(){    
        if (!this.image) {
            return;
        }
        let  sizeMod=Math.max(0, (this.x+TILE_SIZE)-game_Camera.max_X);
        ctx.drawImage(Tile.image, (this.posX-1)*TILE_SIZE, (this.posY-1)*TILE_SIZE, TILE_SIZE-sizeMod, TILE_SIZE, this.x, this.y, TILE_SIZE-sizeMod, TILE_SIZE);
    }
}

class Sky extends Tile{
    constructor(x, y, color) {
        super(x, y);
        this.soft=1;
        this.color=color;
    }
    draw(ctx) {
        ctx.fillStyle=this.color;//"#2B425D"
        ctx.fillRect(0,0,this.x,this.y);
    }
}

class Star extends Tile{
    constructor(x, y, type) {
        super(x, y);
        this.image = Tile.image;
        this.posX=4+type;
        this.posY=2;
        this.type=type;
        this.soft=1;
    }
   
    draw(){    
        if (!this.image) {
            return;
        }
        let  sizeMod=Math.max(0, (this.x+TILE_SIZE)-game_Camera.max_X);
        ctx.drawImage(Tile.image, (this.posX-1)*TILE_SIZE, (this.posY-1)*TILE_SIZE, TILE_SIZE-sizeMod, TILE_SIZE, this.x, this.y, TILE_SIZE-sizeMod, TILE_SIZE);
     }
}

class Ground extends Tile {
    constructor(x, y, posX,posY) {
        super(x, y);
        this.image = Tile.image;
        this.posX=posX;
        this.posY=posY;
        this.type=5;
        if( (posX==4 && posY==3)|| (posX==6 && posY==3)
            || (posX==7 && posY==3)|| (posX==8 && posY==3)
            || (posX==4 && posY==2)|| (posX==6 && posY==2)
            || (posX==7 && posY==2)|| (posX==8 && posY==2)
            || posX>8
            ){this.soft=1;}else{this.soft=0;}
    }

    draw(ctx) {
        if (!this.image) {
            return;
        }
        let mod=0;let sizeMod=0;
        mod= game_Camera.getMod();
        if( (this.y<=game_Camera.max_Y && this.x<(game_Camera.max_X))){
            sizeMod=Math.max(0, (this.x+TILE_SIZE)-game_Camera.max_X);
            ctx.drawImage(Tile.image, (this.posX-1)*TILE_SIZE, (this.posY-1)*TILE_SIZE, TILE_SIZE-sizeMod, TILE_SIZE, this.x-mod, this.y, TILE_SIZE-sizeMod, TILE_SIZE);
        }
    }
}

class Cloud extends Tile{
    constructor(x, y, type) {
        super(x, y);
        this.soft=1;
        this.type=type;
        this.image=Cloud.image;
    }
    draw(ctx) {
        ctx.drawImage(this.image[this.type-1],this.x,this.y);
    }
}
Cloud.image=[
    new load.image('img/platforms/cloud1.png'),
    new load.image('img/platforms/darkCloud.png'),
    new load.image('img/platforms/darkCloud2.png'),
    new load.image('img/platforms/darkCloud3.png')
];

class BackGround extends Tile{
    constructor(x, y, type){
        super(x*TILE_SIZE,y*TILE_SIZE+6);
        this.type=type;
        this.image=BackGround.image[type];
        this.soft=1;
    }

    getWidth() {
        return this.image.width;
    }

    getHeight() {
        return this.image.height;
    }

    draw(ctx) {
        if (!this.image) {
            return;
        }
        let mod=0;let sizeMod=0;
        mod= game_Camera.getMod();
        if( (this.y<=game_Camera.max_Y && this.x<(game_Camera.max_X))){
            sizeMod=Math.max(0, (this.x+this.getWidth()-1)-game_Camera.max_X);
            ctx.drawImage(this.image, 1, 1, this.getWidth()-sizeMod, this.getHeight() , this.x-mod, this.y, this.getWidth()-1-sizeMod, this.getHeight());
           // ctx.drawImage(this.image, this.x, this.y, this.getWidth()-sizeMod, this.getHeight() );
        }
    }

}
BackGround.image=[
    new load.image('img/platforms/fa.png'), // 3 magas
    new load.image('img/platforms/fa2.png'),
    new load.image('img/platforms/fa3.png'),
    new load.image('img/platforms/fa4.png') 
];