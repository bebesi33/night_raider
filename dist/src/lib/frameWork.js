var fw = {};

fw._pressedKeys = {}; //asszociatív tömbben tároljuk, hogy egy gomb le van-e nyomva
document.onkeydown = function(e) {
    fw._pressedKeys[e.which] = true;
};

document.onkeyup = function(e) {
    fw._pressedKeys[e.which] = false;
};

fw.isDown = function(key) {
    return fw._pressedKeys[key] === true;
};

fw.rectIntersect = function(x1, y1, w1, h1, x2, y2, w2, h2) { //egyszerû metszés vizsgálat
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}

fw.createIndex = function(scene, size, limit) { //bin index készítés
    if (!size) {
        size =256 ;
    }
    if (!limit) {
        limit =2 ;
    }
    var grid = {};
    scene.entities.forEach(entity => {

        //entitás szélének meghatározása (cella szélek)
        var left = entity.getLeft();
        var top = entity.getTop();
        var cellLeft = Math.floor(left / size)-limit;
        var cellTop = Math.floor(top / size)-limit;
        var cellRight = Math.floor((left + entity.getWidth()) / size)+limit;
        var cellBottom = Math.floor((top + entity.getHeight()) / size)+limit;

        //végig megyünk az összes cellán, amit érint az entitás
        for (var x = cellLeft; x <= cellRight; x++) {
            for (var y = cellTop; y <= cellBottom; y++) {
                var cellKey = key(x, y);
                var cellData = grid[cellKey]; //az adott koordinátához tartozó cella infó lekérése
                if (!cellData) { //a cella üres volt
                    grid[cellKey] = [entity]; //a cella mostantól egy elemet tartalmaz: az entitást
                } else {
                    cellData.push(entity); //a cellához hozzáadunk még egy elemet
                }
            }
        }
    });

    function key(x, y) {
        return x + ',' + y;
    }

    return {
        query: function(left, top, width, height, limit) {
            var cellLeft = Math.floor(left / size)-limit;
            var cellTop = Math.floor(top / size)-limit;
            var cellRight = Math.floor((left + width) / size)+limit;
            var cellBottom = Math.floor((top + height) / size)+limit;

            var result = [];
            for (var x = cellLeft; x <= cellRight; x++) {
                for (var y = cellTop; y <= cellBottom; y++) {
                    var cellKey = key(x, y);
                    var cellData = grid[cellKey]; //az adott koordinátához tartozó cella infó lekérése
                    if (!cellData) { //a cellában nincs elem
                        continue;
                    }
                    for (var j = 0; j < cellData.length; j++) { //a cella minden elemét belerakjuk, ha még nem volt benne
                        var entity = cellData[j];
                        if (result.indexOf(entity) !== -1) { //már benne van az eredmény tömbben
                            continue;
                        }
                        if (!fw.rectIntersect(left, top, width, height, entity.getLeft(), entity.getTop(), entity.getWidth(), entity.getHeight())) {
                            continue; //ha ugyan a cella stimmel, de mégsem metszik egymást
                        }
                        result.push(entity);
                    }
                }
            }
            return result;
        }
    };
};

fw.Entity = class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this._events = new Map();
    }

    getLeft() {
        return this.x;
    }

    getTop() {
        return this.y;
    }

    getWidth() {
        return 0;
    }

    getHeight() {
        return 0;
    }
};

fw.EntityWithSprite = class EntityWithSprite extends fw.Entity {
    constructor(x, y) {
        super(x, y);
        this.image = null;
    }

    draw(ctx) {
        if (!this.image) {
            return;
        }
        //üres metódus, egyedileg fel kell tölteni...
    }

    getWidth() {
        return this.image ? this.image.width : 0;
    }

    getHeight() {
        return this.image ? this.image.height : 0;
    }
};
fw.EntityWithSprite.events = ['remove','draw'];

fw.Scene = class Scene {
    constructor() {
        this.entities = new Set();
        this.entitiesByEvents = new Map();

        this.add.apply(this, arguments);
    }

    add() {
        for (const entity of arguments) {
            this.entities.add(entity);

            const events = this.getEvents(entity.constructor);
            events.forEach((listeners, ev) => {
                const data = {entity, listeners};
                if (this.entitiesByEvents.has(ev)) {
                    this.entitiesByEvents.get(ev).add(data);
                } else {
                    this.entitiesByEvents.set(ev, new Set([data]));
                }
            });
        }
    }

    remove(entity) {
        this.entities.delete(entity);
        const events = this.getEvents(entity.constructor);
        events.forEach((listeners, ev) => {
            let evs = this.entitiesByEvents.get(ev);
            evs.forEach(data => {
                if (data.entity === entity) {
                    evs.delete(data);
                }
            });
        });
    }

    fire(event, payload) {
        if (!this.entitiesByEvents.has(event)) {
            return;
        }

        const entities = this.entitiesByEvents.get(event);
        entities.forEach(data => {
            const entity = data.entity;
            for (const listener of data.listeners) {
                listener.call(entity, payload);
            }
        });
    }

    getEvents(constructor) {
        if (fw.Scene._eventsByClass.has(constructor)) {
            return fw.Scene._eventsByClass.get(constructor);
        }

        const events = new Map();
        fw.Scene._eventsByClass.set(constructor, events);
        while (true) {
            if (constructor.events) {
                for (const event of constructor.events) {
                    const listener = constructor.prototype[event];
                    if (events.has(event)) {
                        events.get(event).push(listener)
                    } else {
                        events.set(event, [listener]);
                    }
                }
            }

            let parent = Object.getPrototypeOf(constructor.prototype);
            if (!parent) {
                break;
            }
            constructor = parent.constructor;
        }
        return events;
    }
};
fw.Scene._eventsByClass = new Map();

// game manager class is implemented here
fw.Game_Manager = class Game_Manager {
    constructor(){

        this.state="Menu";// "In Game", "Lost", "Won","Won ++", "Help","Cheats","Menu"
        this.prev_Map=0;
        this.win_condition=0;
        this.current_Map=0;
        this.maps=[lvl0,lvl1,lvl2,lvl3];
        this.buttons=[
            new fw.Button( 600, 930, 130, 185, fw.Game_Manager.button_Image_List[0] ),
            new fw.Button( 600, 930, 205, 260, fw.Game_Manager.button_Image_List[1] ), 
            new fw.Button( 600, 930, 280, 335, fw.Game_Manager.button_Image_List[2] ), 
            new fw.Button( 600, 930, 355, 410, fw.Game_Manager.button_Image_List[3] )
        ];
        this.backToMenu=new fw.Button(10 , 176 , 10, 39 , fw.Game_Manager.backToMenu);
        this.write_Time=0;
        this.sounds=fw.Game_Manager.sounds;
        // hero
        this.x=0;this.y=0;
        this.hit_points=400;
        this.soundPlayed=0;
    }

    set_Win_Condition(win_condition){
        this.win_condition=win_condition;
    }

    set_Game_State_Params(hero_X,hero_Y, hero_hp){
        this.y=hero_Y;
        this.x=hero_X;
        this.hit_points=hero_hp;
    }

    check_Game_State(){
        if( this.x>= this.win_condition & this.write_Time==0 ){this.state="Won";
            this.prev_Map=this.current_Map;
            this.current_Map=Math.min(this.current_Map+1,this.maps.length-1);
            this.write_Time=1;
        }
        if( this.y>672 || this.hit_points<1 ){this.state="Lost"}
        return ( this.y>672 || this.hit_points<1 || this.x>= this.win_condition );
    }
    start_Game(){
        this.soundPlayed=0;
        this.write_Time=0;
        this.state="In Game";
        initialize(this.maps[this.current_Map]);
    }
    back_To_Menu(){
        this.write_Time=0;
        this.state="Menu";
        this.prev_Map=0;
        this.current_Map=0;
        this.x=0;this.y=0; this.hit_points=400;
        initialize(this.maps[0]);
    }

    reset_Mouse(){
        mouse_Y=0;
        mouse_X=0;
    }

    set_cheat(){
        var cheatCode = prompt("Enter the cheat code!", " ");
        for( var i=0 ; i<this.maps.length;i++){
            if(this.maps[i].unlock==cheatCode ){this.current_Map=i;}
        }
    }

    refresh(){
        // el kell indítani a játékot
        // klickelés
        if( this.buttons[0].check_Clicked(mouse_X ,mouse_Y ) && this.state=="Menu"){this.state="In Game";this.start_Game(); this.sounds[1].play();this.reset_Mouse();}
        if( this.buttons[1].check_Clicked(mouse_X ,mouse_Y ) && this.state=="Menu"){this.state="Help";this.sounds[2].play();this.reset_Mouse();}
        if( this.buttons[2].check_Clicked(mouse_X ,mouse_Y ) && this.state=="Menu"){this.sounds[2].play();this.set_cheat();this.reset_Mouse();}
        if( this.buttons[3].check_Clicked(mouse_X ,mouse_Y ) && this.state=="Menu"){this.sounds[2].play();window.close();}
        if( this.backToMenu.check_Clicked(mouse_X ,mouse_Y )&& this.state!="Menu"){this.back_To_Menu();this.sounds[2].play();this.reset_Mouse();}

        if( this.check_Game_State() & this.write_Time==0 ){
            this.start_Game();
        }

        if ( this.write_Time>0 & this.state!="Menu") {
            if (pressedKeys.has(13) ){
                if((this.prev_Map+1)<(this.maps.length)){
                    this.start_Game();
                }else{
                    this.back_To_Menu();
                }
            }
        }

        this.draw(ctx);

    }

    draw(ctx){
        if(this.state=="Menu"){
            ctx.drawImage(fw.Game_Manager.backgrounds[0],1,1);
            for(let i = 0; i < this.buttons.length;i++){
                this.buttons[i].draw(ctx);
            }
            ctx.drawImage(fw.Game_Manager.title,30,30);
            ctx.drawImage(fw.Game_Manager.credit,1,630);
        }
        if(this.state=="Help"){
            ctx.drawImage(fw.Game_Manager.backgrounds[1],3,1);
        }
        if(this.state!="Menu"){
           this.backToMenu.draw(ctx);
        }
        if(this.write_Time>0 & this.state!="Menu"){
            ctx.fillStyle = "#3aed04";
            ctx.font = "30pt sans-serif";
            
            if((this.prev_Map+1)<(this.maps.length)){
                ctx.fillText("You won!", 375, 300);
                ctx.fillText("Press enter to continue", 265, 350);
                ctx.font = "20pt sans-serif";
                ctx.fillText("Map unlocked! code: " + this.maps[this.prev_Map].unlock , 310, 400);
                if(this.soundPlayed<1){this.sounds[0].play();this.soundPlayed=1;}
            }else{
                ctx.fillText("You're winner!", 345, 300);
                ctx.fillText("You completed the game!", 265, 350);
                ctx.fillText("Press enter to continue", 265, 400);
                ctx.font = "20pt sans-serif";
                ctx.fillText("Map unlocked! code: " + this.maps[this.prev_Map].unlock , 310, 450);
                if(this.soundPlayed<1){this.sounds[3].play();this.soundPlayed=1;}
            }
        }
    }

    return_map(){
        return this.maps[this.current_Map];
    }
}
fw.Game_Manager.button_Image_List=[
    new load.image('img/menu/startGame.png'),
    new load.image('img/menu/help.png'),
    new load.image('img/menu/cheats.png'),
    new load.image('img/menu/quit.png')
];
fw.Game_Manager.backgrounds=[
    new load.image('img/menu/baseMenu_v1.png'),
    new load.image('img/menu/Guide.png')
];
fw.Game_Manager.backToMenu=new load.image('img/menu/backToMenu.png');
fw.Game_Manager.sounds=[
    new Audio('sounds/TaDa.wav'),
    new Audio('sounds/m3-1_short.wav'),
    new Audio('sounds/button.wav'),
    new Audio('sounds/win.mp3'),
]
fw.Game_Manager.title= new load.image('img/menu/title.png');
fw.Game_Manager.credit= new load.image('img/menu/credit.png');

// buttons and additional utility
fw.Button = class Button {
    constructor( x_L, x_R, y_T, y_B, image ){
        this.x_Left=x_L;
        this.x_Right=x_R;
        this.y_Top=y_T;
        this.y_Bot=y_B;
        this.image=image;
    }

    check_Clicked( x , y){
        return(  
            this.x_Left<=x && x<=this.x_Right &&
            this.y_Top<=y && y<=this.y_Bot
        );
    }

    draw(ctx){
        ctx.drawImage(this.image,this.x_Left, this.y_Top);
    }
}