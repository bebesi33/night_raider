function levelManager(scene, lvl){
// a scene objectumot tölti fel...
// level egy int ami megadja h. melyik pályát töltse be
let OFFSET=10;
Tile.image=load.image(lvl.tileTheme);
// az ég beállítása
    scene.add( new Sky(C_WIDTH,C_HEIGHT,lvl.skyColor));
    scene.add(new Moon(800,60));
    
if(lvl.starsON>0){
    for(var i = 0; i < stars.length; i++){
        scene.add(  new Star((stars[i][1]-1),(stars[i][0]-1),stars[i][2]) );
    }
}

for(var i = 0; i < lvl.cloudList.length; i++){
    scene.add(  new Cloud(lvl.cloudList[i][0],lvl.cloudList[i][1],lvl.cloudList[i][2]) );
}

//További háttérelemek
for(var i = 0; i < lvl.backGroundList.length; i++){
    scene.add(  new BackGround(lvl.backGroundList[i][0],lvl.backGroundList[i][1],lvl.backGroundList[i][2]) );
}

// madarak hozzáadása (: 
for(var i = 0; i < lvl.birdList.length; i++){
    scene.add(  new Bird(lvl.birdList[i][0],lvl.birdList[i][1],lvl.birdList[i][2]) );
}

// platformok betöltése és pálya beállítás:
game_Camera.setLevelLength(lvl.level_Length);
    for(var i = 0; i < lvl.tiles_List.length; i++){
        scene.add(  new Ground((lvl.tiles_List[i][1]-1)*TILE_SIZE,(lvl.tiles_List[i][0]+OFFSET-1)*TILE_SIZE,lvl.tiles_List[i][3],lvl.tiles_List[i][2]) );
    }
//ellenségek hozzáadása
    for(var i = 0; i < lvl.zombies.length; i++){
        scene.add(  new Enemy(
            (lvl.zombies[i][1]-1)*TILE_SIZE-1, 
            (lvl.zombies[i][0]+OFFSET-3)*TILE_SIZE,
            (lvl.zombies[i][2]-1)*TILE_SIZE+1, 
            lvl.zombies[i][3]*TILE_SIZE, 
            lvl.zombies[i][4]
        ) );
    }

// adjuk hozzá a cukorkákat is ;) 
for(var i = 0; i < lvl.candies.length; i++){
    
    if( lvl.candies[i][2]>0){
        scene.add(  new Heart(
            (lvl.candies[i][1]-1)*TILE_SIZE-1, 
            (lvl.candies[i][0]+OFFSET-3)*TILE_SIZE
        ) );
    }else{
        scene.add(  new Cartridge(
            (lvl.candies[i][1]-1)*TILE_SIZE-1, 
            (lvl.candies[i][0]+OFFSET-3)*TILE_SIZE
        ) );
    }
}
//A hős hozzáadása
scene.add(new Hero(100,100));

// győzelmi feltétel beállítása
game_Manager.set_Win_Condition(lvl.win_condition)

}