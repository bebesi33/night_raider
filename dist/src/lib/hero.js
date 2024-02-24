class Hero extends fw.Entity {
    constructor(x, y) {
        super(x, y);
       
        this.xStart=0;
        this.width=31;//31 az eredeti érték
        this.height=64;//64 az eredeti érték

        // egy adattárolóban helyezem el a hőst leíró  extra változókat
        this.data=new StateData( 1, 1, 0, 0, 400 ,0 , 10 );
        this.state=new State();
        this.mode_CD=0;

        // megjelenítés
        this.image_Handler=[
            new Hero_Image('img/hero/_Mode-Sword' ),
            new Hero_Image('img/hero/_Mode-Gun' )
        ]

        //hangok
        this.sounds=[Hero.bitten];
    }
    draw(ctx) {
        let ret=this.x;
        if(this.data.mode==1 && this.data.dir==0){ret-=10;} // nem teljesen egy méretűek a képkockák fegyverváltásnál nagy lenne az eltérs emiatt kell a trükk. 
        ctx.drawImage(this.state.generateImage(this), ret-game_Camera.getMod(), this.y);
        
        // játék info:
        ctx.fillStyle="#FF0000";
        ctx.fillRect(80, 640,200,10);
        ctx.fillStyle="#3aed04";
        ctx.fillRect(80, 640,Math.max(0,Math.floor(this.data.hit_points/2)),10);
        ctx.fillStyle = "#3aed04";
        ctx.font = "10pt sans-serif";
        ctx.fillText("Hit Points:", 10, 648);
        ctx.fillStyle = "#3aed04";
        ctx.font = "10pt sans-serif";
        ctx.fillText("Bullets:", 300, 648);
        ctx.fillStyle = "#3aed04";
        ctx.font = "10pt sans-serif";
        ctx.fillText(this.data.bullets, 350, 648);
    }
    getLeft() {
        return this.x+18;//18 az eredeti érték
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
    getTop() {
        return this.y;
    }

    move() {

        const entitiesInWay_Y = index.query(this.getLeft(), this.getTop()+this.data.dy, this.getWidth(), this.getHeight(),5);

        let min_dY=this.data.dy;
        let botCollision=0;
        let topCollision=0;
        for (const entity of entitiesInWay_Y) {
            // ki kell keresni a max megendedhető esést...
            if (entity instanceof Tile && entity.soft==0) {
                //this.data.inAir=0; Collision=1;
                // ha lefele van akadály
                if( (entity.getTop()-this.y-this.height) < min_dY && this.data.dy>0 ){
                    min_dY=(entity.getTop()-this.y-this.height);
                    this.data.inAir=0; botCollision=1;
                }
                // ha felfele van akadály
                if( ((entity.getTop()+entity.getHeight())-this.y) > min_dY && this.data.dy<0 ){
                    min_dY=((entity.getTop()+entity.getHeight())-this.y);
                    topCollision=1;
                }
                
            }
        }
        if(topCollision>0){
            this.data.inAir=1;this.data.dy=0;
            this.state.goJumpState(this);
        }
        if( botCollision==0 ){
            this.data.inAir=1;
            this.state.goJumpState(this);
        }//ha nem ütközik semmivel akkor szabadesés
        
        if( min_dY<-21 ){min_dY=0;}//hard coding-al kijavítok pár hibát
        if( min_dY>10 ){min_dY=0;}
        this.y += min_dY;
        this.y=Math.max(-TILE_SIZE,this.y);

        let noXCollision=1;
        const entitiesInWay_X = index.query(this.getLeft()+this.data.dx, this.getTop()+min_dY, this.getWidth(), this.getHeight(),5);
        for (const entity of entitiesInWay_X) {
            if (entity instanceof Tile && entity.soft==0) {
                if(topCollision<1){ this.x+=-this.data.dx*(1-topCollision);noXCollision=0;}
                this.data.dx=0;
            }
            else
            {          
                this.x += this.data.dx;
                this.x=Math.min( game_Camera.level_Length-this.width ,Math.max(-TILE_SIZE,this.x));
            }
        }

        //további kiértékelés a zombikkal, felvehető tárgyakkal:
        const entitiesInWay_hp = index.query(this.getLeft()+this.data.dx, this.getTop()+this.data.dy, this.getWidth(), this.getHeight(),3);
        for (const entity of entitiesInWay_hp) {
            if (entity instanceof Enemy && entity.dead!=1 ) {
                this.data.hit_points=Math.max(this.data.hit_points-entity.type,0);this.sounds[0].play();
                this.state.goHurtState(this);
            }
            if (entity instanceof Heart) {
                this.data.hit_points=Math.min(entity.add_stats()+this.data.hit_points,400);entity.remove();
            }
            if (entity instanceof Cartridge) {
                this.data.bullets+=entity.add_stats();entity.remove();
            }
        }
        if( this.data.inAir==0  ){this.data.dx=0;}

        if(noXCollision<1 || topCollision>0 ){
            game_Camera.move(0);}else{
                game_Camera.move(this.x);
            }
    }

    update() {
        this.state.refresh(this);
        this.move();
        //a végén bekéri a játék az infokat
        game_Manager.set_Game_State_Params(this.x,this.y, this.data.hit_points);
    }

    shoot(){
        if(this.data.mode==1){
            if(this.data.bullets>0){scene.add(new Bullet(this.x , this.y , this.data.dir));this.data.bullets--;}
        }else{
            scene.add(new Sword(this.x , this.y , this.data.dir));
        }
    }

}
Hero.events = ['update', 'draw']; 
Hero.bitten = new Audio('sounds/Bite-SoundBible.com-2056759375.wav');
Hero.jumpSound= new Audio('sounds/jump.wav');

//segéd class: State-és egyebek.
class StateData{
    constructor(dir, inAir, dx, dy, hp, mode , bullet){
        this.dir = dir; /* 0 akkor balra néz, 1 akkor jobb */
        this.inAir=inAir;
        this.dx=dx;
        this.dy=dy;
        this.hit_points=hp;
        this.mode=mode; /* 0: kés, 1: lőfegyver */
        this.bullets=bullet;
    }
}

class State{
    constructor(){
        this.frame=0;
    }

    refresh(hero){
    //
        this.gravity(hero);
        this.weaponSwitch(hero);
        this.frame=( this.frame+1) % 200;

        if (pressedKeys.has(37)) { //bal
            hero.data.dx=-3;hero.data.dir=0;
            hero.state=new RunningState(hero.state.frame, hero.x);
        }
        if (pressedKeys.has(39)) { //jobb
            hero.data.dx=3;hero.data.dir=1;
            hero.state=new RunningState(hero.state.frame, hero.x);
        }
        if (pressedKeys.has(38) && hero.data.inAir==0 ) { //fel
            hero.data.dy=-21;hero.data.inAir=1;
            this.state=new JumpState(this.y);
            Hero.jumpSound.play();
        }

        if (pressedKeys.has(32) && !(hero.state instanceof ShootState) ) { //szóköz, lövés
            hero.state= new ShootState();
            hero.shoot();
        }
    }

    gravity(hero){
        if(hero.data.inAir==1){hero.data.dy++;hero.data.dy=Math.min(10,hero.data.dy);}
    }

    weaponSwitch(hero){
        if(hero.mode_CD>0){hero.mode_CD--;}
        if(hero.data.bullets==0){hero.data.mode=0;}
        if(pressedKeys.has(17) && hero.mode_CD==0 && hero.data.bullets!=0 ){
            hero.data.mode=(hero.data.mode+1) % 2;hero.mode_CD=20;
        }
    }

    goHurtState(hero){
        hero.state=new HurtState();
    }

    goJumpState(hero){
        hero.state=new JumpState(hero.y);
    }

    generateImage(hero){
        //felül kell írni mindenhol kíméletlenül...
        let image;
        if(hero.data.dir==1){
            image=hero.image_Handler[hero.data.mode].Idle_Right[Math.floor( (this.frame % 50 )/5 ) ];
            }else{
            image=hero.image_Handler[hero.data.mode].Idle_Left[Math.floor( (this.frame % 50 )/5 ) ];
        }   
        return(image);
    }

}


class JumpState extends State{

    constructor(y){
        super();
        this.y=y;
        this.lastY=0;
    }

    refresh(hero){
        super.refresh(hero);
        if(this.y==this.lastY){hero.state=new State();}
        this.lastY=this.y;
        this.y=hero.y;
    }

    generateImage(hero){
        //felül kell írni mindenhol kíméletlenül...
        let image;
        if(hero.data.dir==1){
            image=hero.image_Handler[hero.data.mode].Jump_Right;
            }else{
            image=hero.image_Handler[hero.data.mode].Jump_Left;
        }   
        return(image);
    }
}

class ShootState extends State{
/*
Majdnem mindennel szemben elsőbbéget élvez, ebből nem lehet átmenni ugrásba v. sérülésbe
futás is csak akkor, ha 15 frame felett járunk (animation canceling  (: )
*/
    refresh(hero){
        this.gravity(hero);
        this.frame++;

        if (pressedKeys.has(37) && this.frame>15) { //bal
            hero.data.dx=-3;hero.data.dir=0;
            hero.state=new RunningState(hero.state.frame, hero.x);
        }
        if (pressedKeys.has(39) && this.frame>15 ) { //jobb
            hero.data.dx=3;hero.data.dir=1;
            hero.state=new RunningState(hero.state.frame, hero.x);
        }

        if(this.frame>39){
            hero.state= new State();
        }
    }

    generateImage(hero){
        //felül kell írni mindenhol kíméletlenül...
        let image;
        if(hero.data.dir==1){
            image=hero.image_Handler[hero.data.mode].Shot_Right[ ( Math.floor(this.frame/4) % 10  )  ];
            }else{
            image=hero.image_Handler[hero.data.mode].Shot_Left[  ( Math.floor(this.frame/4) % 10  )  ];
        }   
        return(image);
    }

    goJumpState(hero){
        //empty... nem csinál semmit.
    }

    goHurtState(hero){
        //empty... nem csinál semmit.
    }


}

class RunningState extends State{

    constructor(frame,x){
        super();
        this.frame=(frame+1) % 200;
        this.x=x;
        this.lastX=0;
    }

    refresh(hero){
        super.refresh(hero);
        if(this.x==this.lastX){hero.state=new State();}
        this.lastX=this.x;
        this.x=hero.x;
    }

    generateImage(hero){
        //felül kell írni mindenhol kíméletlenül...
        let image;
        if(hero.data.dir==1){
            image=hero.image_Handler[hero.data.mode].Run_Right[Math.floor( (this.frame % 40  )/4 ) ];
            }else{
            image=hero.image_Handler[hero.data.mode].Run_Left[Math.floor( (this.frame % 40 )/4 ) ];
        }   
        return(image);
    }
}

class HurtState extends State{

    refresh(hero){
        super.refresh(hero);
        this.frame++;
        if(this.frame>19){
            hero.state= new State();
        }
    }

    generateImage(hero){
        //felül kell írni mindenhol kíméletlenül...
        let image;
        if(hero.data.dir==1){
            image=hero.image_Handler[hero.data.mode].Hurt_Right[ Math.floor(this.frame/2) % 10 ];
            }else{
            image=hero.image_Handler[hero.data.mode].Hurt_Left[ Math.floor(this.frame/2) % 10 ];
        }   
        return(image);
    }

    goJumpState(hero){
       //empty... nem csinál semmit.
    }

}