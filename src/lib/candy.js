class Candy extends fw.Entity {
    constructor(x,y){
        super(x,y);
        this.add_Hit_Points=0;
        this.add_Bullets=0;
        this.image;
        this.frame=1;
        this.width=66;
        this.height=66;
        this.sound=Candy.sound;
        this.numb_Frames=30;
    }

    remove(){
        scene.remove( this );this.sound.play();
    }

    add(){
        scene.add( this );
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    add_stats(){
        return this.add_Hit_Points;
    }

    draw(ctx) {
    }
}
Candy.events =  [ 'draw' , 'remove']; 
Candy.sound = new Audio('sounds/smb3_sound_effects_1_up.wav');

class Heart extends Candy{
    constructor(x,y){
        super(x,y);
        this.add_Hit_Points=100;
        this.add_Bullets=0;
        this.image=Heart.image;
        this.sound=Heart.sound;
    }

    draw(ctx) {
        this.frame++;this.frame=this.frame % this.numb_Frames;
        let mod = 0;let sizeMod = 0;
        sizeMod = Math.max(0, (this.x+this.width)-game_Camera.max_X);
        mod = game_Camera.getMod();
        if( (this.y<=game_Camera.max_Y && this.x<(game_Camera.max_X))){
            ctx.drawImage(this.image, (this.frame)*this.width, 1, this.width-sizeMod, this.height, this.x-mod, this.y, this.width-sizeMod, this.height);
        }
    }

}
Heart.events =  [ 'draw' , 'remove']; 
Heart.image=load.image('img/candies/heart_animation.png');
Heart.sound = new Audio('sounds/smb3_sound_effects_1_up.wav');

class Cartridge extends Candy{
    constructor(x,y){
        super(x,y);
        this.add_Hit_Points=0;
        this.add_Bullets=10;
        this.image=Cartridge.image;
        this.width=61;
        this.height=30;
        this.sound=Cartridge.sound;
        this.numb_Frames=14;
    }

    draw(ctx) {
        this.frame++;this.frame=this.frame % this.numb_Frames;
        let mod = 0;let sizeMod = 0;
        sizeMod = Math.max(0, (this.x+this.width)-game_Camera.max_X);
        mod = game_Camera.getMod();
            if( (this.y<=game_Camera.max_Y && this.x<(game_Camera.max_X))){
                ctx.drawImage(this.image[this.frame], 1, 1, this.width-sizeMod, this.height, this.x-mod, this.y, this.width-sizeMod, this.height)
            }
    }

    add_stats(){
        return this.add_Bullets;
    }
}

Cartridge.events =  [ 'draw' , 'remove']; 
Cartridge.sound = new Audio('sounds/smb3_sound_effects_1_up.wav');
Cartridge.image=[
    new load.image('img/candies/shell00.png'),
    new load.image('img/candies/shell01.png'),
    new load.image('img/candies/shell02.png'),
    new load.image('img/candies/shell03.png'),
    new load.image('img/candies/shell04.png'),
    new load.image('img/candies/shell05.png'),
    new load.image('img/candies/shell06.png'),
    new load.image('img/candies/shell07.png'),
    new load.image('img/candies/shell08.png'),
    new load.image('img/candies/shell09.png'),
    new load.image('img/candies/shell10.png'),
    new load.image('img/candies/shell11.png'),
    new load.image('img/candies/shell12.png'),
    new load.image('img/candies/shell13.png'),
    new load.image('img/candies/shell14.png')
];


class Grave extends fw.Entity {

    constructor(x,y){
        super(x,y);
        this.x=x+20;
        this.y=y+100;
        this.image=Grave.image[ Math.min(2,Math.floor(Math.random()*3)) ];
        this.frame=1;
    }

    remove(){
        scene.remove( this );this.sound.play();
    }

    add(){
        scene.add( this );
    }

    draw(ctx) {
        let mod=0;let sizeMod=0;
        sizeMod=Math.max(0, (this.x+42)-game_Camera.max_X);
        mod= game_Camera.getMod();
        if( (this.y<=game_Camera.max_Y && this.x<(game_Camera.max_X))){
            ctx.drawImage(this.image, 1, 1, 42-sizeMod, this.frame, this.x-mod, this.y-this.frame, 42-sizeMod, this.frame)
            //ctx.drawImage(this.image, this.x-mod, this.y-this.frame);
        }
        this.frame=Math.min(50,this.frame+2);
    }

}
Grave.events =  [ 'draw' , 'add']; 
Grave.image=[ new load.image('img/enemies/graves/g1.png'),
                new load.image('img/enemies/graves/g2.png'),
                new load.image('img/enemies/graves/g3.png')
];