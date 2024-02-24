class Hero_Image {

    constructor(mode) {

        this.mode = mode;

        // képek betöltése :) 
        this.Jump_Left=load.image( this.mode.concat('/05_Jump/Jump_000b.png') );
        this.Jump_Right=load.image( this.mode.concat('/05_Jump/Jump_000.png') );

        this.Idle_Left=[
            new load.image(this.mode.concat('/01_Idle/left/Idle_000b.png')),
            new load.image(this.mode.concat('/01_Idle/left/Idle_001b.png')),
            new load.image(this.mode.concat('/01_Idle/left/Idle_002b.png')),
            new load.image(this.mode.concat('/01_Idle/left/Idle_003b.png')),
            new load.image(this.mode.concat('/01_Idle/left/Idle_004b.png')),
            new load.image(this.mode.concat('/01_Idle/left/Idle_005b.png')),
            new load.image(this.mode.concat('/01_Idle/left/Idle_006b.png')),
            new load.image(this.mode.concat('/01_Idle/left/Idle_007b.png')),
            new load.image(this.mode.concat('/01_Idle/left/Idle_008b.png')),
            new load.image(this.mode.concat('/01_Idle/left/Idle_009b.png')),
        ];
        
        this.Idle_Right=[
            new load.image(this.mode.concat('/01_Idle/right/Idle_000.png')),
            new load.image(this.mode.concat('/01_Idle/right/Idle_001.png')),
            new load.image(this.mode.concat('/01_Idle/right/Idle_002.png')),
            new load.image(this.mode.concat('/01_Idle/right/Idle_003.png')),
            new load.image(this.mode.concat('/01_Idle/right/Idle_004.png')),
            new load.image(this.mode.concat('/01_Idle/right/Idle_005.png')),
            new load.image(this.mode.concat('/01_Idle/right/Idle_006.png')),
            new load.image(this.mode.concat('/01_Idle/right/Idle_007.png')),
            new load.image(this.mode.concat('/01_Idle/right/Idle_008.png')),
            new load.image(this.mode.concat('/01_Idle/right/Idle_009.png')),
        ];

        this.Run_Left=[
                new load.image(this.mode.concat('/02_Run/left/Run_000b.png')),
                new load.image(this.mode.concat('/02_Run/left/Run_001b.png')),
                new load.image(this.mode.concat('/02_Run/left/Run_002b.png')),
                new load.image(this.mode.concat('/02_Run/left/Run_003b.png')),
                new load.image(this.mode.concat('/02_Run/left/Run_004b.png')),
                new load.image(this.mode.concat('/02_Run/left/Run_005b.png')),
                new load.image(this.mode.concat('/02_Run/left/Run_006b.png')),
                new load.image(this.mode.concat('/02_Run/left/Run_007b.png')),
                new load.image(this.mode.concat('/02_Run/left/Run_008b.png')),
                new load.image(this.mode.concat('/02_Run/left/Run_009b.png')),
        ];

        this.Run_Right=[
            new load.image(this.mode.concat('/02_Run/right/Run_000.png')),
            new load.image(this.mode.concat('/02_Run/right/Run_001.png')),
            new load.image(this.mode.concat('/02_Run/right/Run_002.png')),
            new load.image(this.mode.concat('/02_Run/right/Run_003.png')),
            new load.image(this.mode.concat('/02_Run/right/Run_004.png')),
            new load.image(this.mode.concat('/02_Run/right/Run_005.png')),
            new load.image(this.mode.concat('/02_Run/right/Run_006.png')),
            new load.image(this.mode.concat('/02_Run/right/Run_007.png')),
            new load.image(this.mode.concat('/02_Run/right/Run_008.png')),
            new load.image(this.mode.concat('/02_Run/right/Run_009.png')),
        ];

        this.Hurt_Left=[
            new load.image(this.mode.concat('/04_Hurt/left/Hurt_000b.png')),
            new load.image(this.mode.concat('/04_Hurt/left/Hurt_001b.png')),
            new load.image(this.mode.concat('/04_Hurt/left/Hurt_002b.png')),
            new load.image(this.mode.concat('/04_Hurt/left/Hurt_003b.png')),
            new load.image(this.mode.concat('/04_Hurt/left/Hurt_004b.png')),
            new load.image(this.mode.concat('/04_Hurt/left/Hurt_005b.png')),
            new load.image(this.mode.concat('/04_Hurt/left/Hurt_006b.png')),
            new load.image(this.mode.concat('/04_Hurt/left/Hurt_007b.png')),
            new load.image(this.mode.concat('/04_Hurt/left/Hurt_008b.png')),
            new load.image(this.mode.concat('/04_Hurt/left/Hurt_009b.png'))
        ];
        this.Hurt_Right=[
            new load.image(this.mode.concat('/04_Hurt/right/Hurt_000.png')),
            new load.image(this.mode.concat('/04_Hurt/right/Hurt_001.png')),
            new load.image(this.mode.concat('/04_Hurt/right/Hurt_002.png')),
            new load.image(this.mode.concat('/04_Hurt/right/Hurt_003.png')),
            new load.image(this.mode.concat('/04_Hurt/right/Hurt_004.png')),
            new load.image(this.mode.concat('/04_Hurt/right/Hurt_005.png')),
            new load.image(this.mode.concat('/04_Hurt/right/Hurt_006.png')),
            new load.image(this.mode.concat('/04_Hurt/right/Hurt_007.png')),
            new load.image(this.mode.concat('/04_Hurt/right/Hurt_008.png')),
            new load.image(this.mode.concat('/04_Hurt/right/Hurt_009.png'))
        ];

        this.Shot_Left=[
            new load.image(this.mode.concat('/03_Shot/left/Attack_000b.png')),
            new load.image(this.mode.concat('/03_Shot/left/Attack_001b.png')),
            new load.image(this.mode.concat('/03_Shot/left/Attack_002b.png')),
            new load.image(this.mode.concat('/03_Shot/left/Attack_003b.png')),
            new load.image(this.mode.concat('/03_Shot/left/Attack_004b.png')),
            new load.image(this.mode.concat('/03_Shot/left/Attack_005b.png')),
            new load.image(this.mode.concat('/03_Shot/left/Attack_006b.png')),
            new load.image(this.mode.concat('/03_Shot/left/Attack_007b.png')),
            new load.image(this.mode.concat('/03_Shot/left/Attack_008b.png')),
            new load.image(this.mode.concat('/03_Shot/left/Attack_009b.png'))
        ];
        this.Shot_Right=[
            new load.image(this.mode.concat('/03_Shot/right/Attack_000.png')),
            new load.image(this.mode.concat('/03_Shot/right/Attack_001.png')),
            new load.image(this.mode.concat('/03_Shot/right/Attack_002.png')),
            new load.image(this.mode.concat('/03_Shot/right/Attack_003.png')),
            new load.image(this.mode.concat('/03_Shot/right/Attack_004.png')),
            new load.image(this.mode.concat('/03_Shot/right/Attack_005.png')),
            new load.image(this.mode.concat('/03_Shot/right/Attack_006.png')),
            new load.image(this.mode.concat('/03_Shot/right/Attack_007.png')),
            new load.image(this.mode.concat('/03_Shot/right/Attack_008.png')),
            new load.image(this.mode.concat('/03_Shot/right/Attack_009.png'))
        ];
    } //end constructor
}