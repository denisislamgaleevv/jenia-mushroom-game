

export default class mainScene extends Phaser.Scene{
    constructor() {
    
        super('mainScene');
        this.ground;
        this.platforms;
        this.cursor;
        this.mushrooms;
        this.player;
        this.enemyDirection = 'right';
        this.enemy2Direction = 'left';
        this.enemy3Direction = 'right';
        this.mushrooms_small;
        this.playerHealth = 100; //Значение здоровья игрока (по умолчанию 100)
        this.inventory = []; // инициализируем inventory как массив
        this.inventoryText;
        this.sword;
        this.haveSword = false; 
        this.poison;
    }
    
    preload(){
        this.load.image('sky', '../../assets/sky.png')
        this.load.image('ground', '../../assets/ground.png')
        this.load.image('platform', '../../assets/platform.jpg')
        this.load.image('mov_platform', '../../assets/platform.jpg')
        this.load.image('mushroom', '../../assets/mushroom.png')
        this.load.image('mushroom_small', '../../assets/mushroom_small.png')

        this.load.image('poison', '../../assets/sword.png')
        this.load.image('sword', '../../assets/sword.png')
        this.load.spritesheet('enemy', '../../assets/enemy/enemy.png', {frameWidth:32, frameHeight: 33})
        this.load.spritesheet('enemy2', '../../assets/enemy2/enemy2.png', {frameWidth:32, frameHeight: 33})
        this.load.spritesheet('enemy3', '../../assets/innocent/innocent.png',  {frameWidth:32, frameHeight: 33})
        this.load.spritesheet('player', '../../assets/player/player.png',{frameWidth: 32, frameHeight: 33} );

        this.load.audio('backgroundMusic', '../../assets/music.mp3');
        this.load.audio('deathMusic', '../../assets/kill.mp3');

    }

    create(){
        // this.movingPLatforms = this.physics.add.group({
        //     allowGravity: false,
        //     immovable:true
        // });
        // this.movingPLatform1 = this.movingPLatforms.create(200, 400, 'mov_platform');
        // this.movingPLatform2 = this.movingPLatforms.create(600, 500, 'mov_platform');
        // this.movingPLatform1.body.velocity.x = 100;
        // this.movingPLatform1.body.velocity.y = 50;
        // this.movingPLatform2.body.velocity.x = -150;
        // this.movingPLatform2.body.velocity.y = 75;
        // this.physics.add.collider(this.player, this.movingPLatforms);

        this.add.image(400,300, 'sky')
        this.ground = this.physics.add.staticGroup();
        this.ground.create(400,600, 'ground')
        this.platforms = this.physics.add.staticGroup();
        this.mushrooms = this.physics.add.staticGroup();
        this.mushrooms_small = this.physics.add.staticGroup();
        this.mushrooms.create(580,350, 'mushroom');
        this.mushrooms.create(200,520, 'mushroom');
        this.mushrooms.create(155,150, 'mushroom');
        this.platforms.create(200,200, 'platform');
        this.platforms.create(300,350, 'platform');
        this.platforms.create(400,110, 'platform');
        this.platforms.create(700,190, 'platform');
        this.platforms.create(900,340, 'platform');
        this.platforms.create(550,400, 'platform');
        this.mushrooms_small.create(250,184, 'mushroom_small');
        this.mushrooms_small.create(1080,435, 'mushroom_small');
        this.platforms.create(1050,450, 'platform');
        this.backgroundMusic = this.sound.add('backgroundMusic');
        this.deathMusic = this.sound.add('deathMusic');
        this.backgroundMusic.play({loop: true});
        
        this.player = this.physics.add.sprite(100, 450, 'player')
        this.player.setCollideWorldBounds(true)
        this.player.setBounce(0.2)
         
        this.cursor = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(this.player, this.platforms)
        this.physics.add.collider(this.player, this.ground)
        this.physics.add.collider(this.player, this.mushrooms)
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player',{start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'runEnemy',
            frames: this.anims.generateFrameNumbers('enemy',{start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'run2Enemy',
            frames: this.anims.generateFrameNumbers('enemy2',{start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'run3Enemy',
            frames: this.anims.generateFrameNumbers('enemy3',{start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        })
        this.enemy = this.physics.add.sprite(500, 300, 'enemy');
        this.enemy2 = this.physics.add.sprite(550, 400, 'enemy');
        this.enemy3 = this.physics.add.sprite(900, 300, 'enemy3');
        this.enemy.setCollideWorldBounds(true);
        this.enemy.setBounce(0.2);
        this.physics.add.collider(this.enemy, this.platforms);
        this.physics.add.collider(this.enemy, this.ground);
        this.physics.add.collider(this.enemy, this.mushrooms)
        this.enemy2.setCollideWorldBounds(true);
        this.enemy2.setBounce(0.2);
        this.enemy3.setCollideWorldBounds(true);
        this.enemy3.setBounce(0.2);
        this.physics.add.collider(this.enemy2, this.platforms);
        this.physics.add.collider(this.enemy2, this.ground);
        this.physics.add.collider(this.enemy2, this.mushrooms)
       
        this.physics.add.collider(this.enemy3, this.platforms);
        this.physics.add.collider(this.enemy3, this.ground);
        this.physics.add.collider(this.enemy3, this.mushrooms)
        this.sword = this.add.sprite(0,0, 'sword');
        this.sword.setVisible(false);

        this.player.sword = this.sword; //Присвоить сворд как свойство плауер
        this.sword.setOrigin(0.5,1);
        this.sword.setRotation(Phaser.Math.DegToRad(0));
        this.poison = this.physics.add.sprite(920, 100, 'poison');
        this.physics.add.collider(this.poison, this.ground);
        this.physics.add.collider(this.poison, this.platforms);
        this.physics.add.overlap(this.player, this.poison, this.collectItem, null, this);
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('player', {
                start: 1,
                end: 3
            }),
            frameRate: 10,
            repeat: 0
        });
        this.physics.add.overlap(this.player,this.enemy,this.attackEnemy, null, this);
        this.physics.add.overlap(this.player,this.enemy2,this.attackEnemy2, null, this);
        this.physics.add.overlap(this.player,this.enemy2,this.attackEnemy3, null, this);
        this.inventoryText = this.add.text(10,60, 'Inventory:', {
            font: '16px Arial',
            fill: '#ffffff'
        });
        this.createHealthBar( )
    }
    attackEnemy(player,enemy){
        if (this.cursor.space.isDown) {
            //выполняем атаку, только если зажата клавиша пробела
            enemy.disableBody(true,true);//уничтожаем врага
        this.deathMusic.play({loop: false});

        }
    
    }
    attackEnemy2(player,enemy2){
        if (this.cursor.space.isDown) {
            //выполняем атаку, только если зажата клавиша пробела
            enemy2.disableBody(true,true);//уничтожаем врага
            this.deathMusic.play({loop: false});

        }
    
    }
    attackEnemy3(player,enemy2){
        if (this.cursor.space.isDown) {
            //выполняем атаку, только если зажата клавиша пробела
            enemy3.disableBody(true,true);//уничтожаем врага
            this.deathMusic.play({loop: false});

        }
    
    }
    collectItem(player, item) {
        item.disableBody(true, true);
        this.inventory.push(item.texture.key);
        this.updateInventoryDisplay();
        this.haveSword = true;
    }
    
    updateInventoryDisplay() {
        this.inventoryText.setText('Inventory:');

        this.inventory.forEach((item, index) => {
            if (item === 'poison') {
                const itemImage = this.add.image(100 + index * 40, 70, item);
                itemImage.setScale(1);
            }
        });
    }
    
    createHealthBar() {
        //
        this.healthBar = this.add.graphics();
        this.updateHealthBar();
    }

    updateHealthBar() {
        //проверка на отрицательное или нулевое значения здоровья
        if (this.playerHealth <= 0) {
            this.playerHealth = 0;
        }

        //Остальной код обновления полоски здоровья
        const x = 10;
        const y = 10;
        const width = 200; 
        const height = 20;

        this.healthBar.clear();
        this.healthBar.fillStyle(0x177245);
        this.healthBar.fillRect(x, y, width * (this.playerHealth / 100), height);
        this.healthBar.lineStyle(2, 0x000000);
        this.healthBar.strokeRect(x, y, width, height);
    }

    handleCollision() {
        //уменьшение здоровья игрока
        this.playerHealth -= 0.01; // уменьшение на 10 едениц (можно изменить)

        if (this.playerHealth <= 0) {
            // игрок погибб воплните необходимые действия
            this.restartGame();
        }

        this.updateHealthBar(); //обновление здоровья
    }

    restartGame() {
        //сброс значений
        this.playerHealth = 100;

        //дополнительно сбросы и действия, если необходимо

        //перезагрузка сцены
        this.scene.restart();
        this.haveSword = false;
    }

    update(time, delta){
        // this.movingPLatform1.x = Phaser.Math.RotateVec3(time * 0.0025, 400, 100)
        // this.movingPLatform1.y = Phaser.Math.Sinusoidal.InOut(time * 0.0025, 400, 100);

        // this.movingPLatform2.x = Phaser.Math.Sinusoidal.InOut(time * 0.0075, 600, 200);
        // this.movingPLatform2.y = Phaser.Math.Sinusoidal.InOut(time * 0.0035, 250, 100);

        this.physics.add.overlap(this.player, this.enemy, this.handleCollision, null, this);
        //враг 1
        if (this.enemyDirection === 'right') {
            this.enemy.setVelocityX(80);
            if(this.enemy.body.touching.down){
                this.enemy.setVelocityY(-80); //жесткий летающий гриб
            }
            this.enemy.flipX = false;
            this.enemy.anims.play('runEnemy', true);
        } else if (this.enemyDirection === 'left') {
            this.enemy.setVelocityX(-80);
            if(this.enemy.body.touching.down){
                this.enemy.setVelocityY(-80); //жесткий летающий гриб
            }
            this.enemy.flipX = true;
            this.enemy.anims.play('runEnemy', true);
        }
        if (this.enemy.body.blocked.right) {
            this.enemyDirection = 'left';
        } else if (this.enemy.body.blocked.left) {
            this.enemyDirection = 'right';
        }




 //враг 2
        if (this.enemy2Direction === 'right') {
           
            this.enemy2.setVelocityX(80);
            
            this.enemy2.flipX = false;
            this.enemy2.anims.play('run2Enemy', true);
        } else if (this.enemy2Direction === 'left') {
            this.enemy2.setVelocityX(-80);
            this.enemy2.flipX = true;
            this.enemy2.anims.play('run2Enemy', true);
        }
        if (this.enemy2.body.blocked.right) {
            this.enemy2Direction = 'left';
        } else if (this.enemy2.body.blocked.left) {
            this.enemy2Direction = 'right';
        }  else if (this.enemy2Direction === 'left') {
            this.enemy2.setVelocityX(-80);
            this.enemy2.flipX = true;
            this.enemy2.anims.play('run2Enemy', true);
        }
        if (this.enemy2.body.blocked.right) {
            this.enemy2Direction = 'left';
        } else if (this.enemy2.body.blocked.left) {
            this.enemy2Direction = 'right';
        }

//враг 3
        if (this.enemy3Direction === 'right') {
           
            this.enemy3.setVelocityX(80);
            
            this.enemy3.flipX = false;
            this.enemy3.anims.play('run3Enemy', true);
        } else if (this.enemy3Direction === 'left') {
            this.enemy3.setVelocityX(-80);
            this.enemy3.flipX = true;
            this.enemy3.anims.play('run3Enemy', true);
        }
        if (this.enemy3.body.blocked.right) {
            this.enemy3Direction = 'left';
        } else if (this.enemy3.body.blocked.left) {
            this.enemy3Direction = 'right';
        }  else if (this.enemy3Direction === 'left') {
            this.enemy3.setVelocityX(-80);
            this.enemy3.flipX = true;
            this.enemy3.anims.play('run3Enemy', true);
        }
        if (this.enemy3.body.blocked.right) {
            this.enemy3Direction = 'left';
        } else if (this.enemy3.body.blocked.left) {
            this.enemy3Direction = 'right';
        }


        

         
        if(this.cursor.left.isDown ){
            this.player.setVelocityX(-160);
            this.player.anims.play('run', true); //воспроизведение анимации бега
            this.player.flipX = true; //Разворот спрайта влево
        }
        else if (this.cursor.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play('run', true); 
            this.player.flipX = false; //Разворот спрайта вправо
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('run'); //остановка анимации бега
            this.player.setTexture('player', 0); //Установка статичного кадра персонажа
    }
        if(this.cursor.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }
        if (this.player.flipX === false) {
            this.sword.setPosition(this.player.x+10, this.player.y+8);
            this.sword.flipX = false
        }
        else{
            this.sword.setPosition(this.player.x-10, this.player.y+8);
            this.sword.flipX = true
        }
       
        if (this.cursor.space.isDown && this.haveSword) {
            this.player.anims.play('attack', true);
            this.sword.setVisible(true);
            if ( this.sword.flipX == true){
                this.sword.setRotation(this.sword.rotation  - 0.1);
                const angle = this.sword.rotation;
                console.log(angle)
            if ( angle > 2){
                this.sword.setRotation(Phaser.Math.DegToRad(0));
                this.physics.add.overlap(this.sword, this.enemy, this.attackEnemy, null, this)
        
                this.physics.add.overlap(this.sword, this.enemy2, this.attackEnemy2, null, this)
                this.physics.add.overlap(this.sword, this.enemy2, this.attackEnemy3, null, this)
        
            }
        }
        else{
            this.sword.setRotation(this.sword.rotation + 0.1);
            const angle = this.sword.rotation;
        
            if (angle> 2){
                this.sword.setRotation(Phaser.Math.DegToRad(0));
            }
        }    
        } else {
        this.sword.setVisible(false);
        this.sword.setRotation(Phaser.Math.DegToRad(0)) 
            }
        this.physics.add.overlap(this.sword, this.enemy, this.attackEnemy, null, this);
        this.physics.add.overlap(this.sword, this.enemy2, this.attackEnemy2, null, this)
        this.physics.add.overlap(this.sword, this.enemy2, this.attackEnemy3, null, this)
        
    }
}