BasicGame.Game = function (game) {};

var cake1;
var timer;
var seconds;
var timerText = "";
var mouseBody;
var mouseConstraint;
var cakeblock1;
var cakeblock2;
var cakeblock3;

BasicGame.Game.prototype = {

	create: function () {
        //Specifying the physics game engine to ARCADE 
		this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.gravity.y = 1000;
	
		this.stage.backgroundColor = "#4488AA";
        
        
		//setup timer
		timer = this.time.create(false);
		seconds = 0;
		timerText.text = 'Time: ' + seconds;
		
		gameOverText = this.add.text(this.world.centerX, this.world.centerY-50, 'Game Over', {
			font: '96px arial',
			fill: '#fff',
			align: 'center'
		});
		gameOverText.anchor.set(0.5);
        //hides the gameState text
		gameOverText.visible = false;
		gameOver = false;
		
		//Create a restart button and hide on screen 
		restartButton = this.add.button((this.world.width / 2), (this.world.height / 2)+50, 'startButton', this.restartGame);
		restartButton.anchor.set(0.5);
		restartButton.visible = false;
		
		//Set a TimerEvent to occur every second and start the timer
		timer.loop(1000, this.updateTimer, this);
		timer.start();
    

    cakeblock1 = this.add.sprite(300, 100, 'cakeblock1');
    cakeblock2 = this.add.sprite(375, 200, 'cakeblock2');
    cakeblock3 = this.add.sprite(450, 300, 'cakeblock3');
      
    cake1 = this.add.sprite((this.world.width / 2), this.world.height - 50, 'cake1');
    cake1.scale.setTo(0.7, 0.2);
    cake1.anchor.setTo(0.5,0);

        
    //  Create collision group for the blocks
    var blockCollisionGroup = this.physics.p2.createCollisionGroup();
    
    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    this.physics.p2.updateBoundsCollisionGroup();
    
    //  Enable the physics bodies on all the sprites
    this.physics.p2.enable([ cakeblock1, cakeblock2, cakeblock3, cake1 ], false);

	
    //physics
    cakeblock1.body.clearShapes();
    cakeblock1.body.loadPolygon('physicsData', 'cakeblock1');
    cakeblock1.body.setCollisionGroup(blockCollisionGroup);
    cakeblock1.body.collides([blockCollisionGroup]);
    
    cakeblock2.body.clearShapes();
    cakeblock2.body.loadPolygon('physicsData', 'cakeblock2');
    cakeblock2.body.setCollisionGroup(blockCollisionGroup);
    cakeblock2.body.collides([blockCollisionGroup]);
    
    cakeblock3.body.clearShapes();
    cakeblock3.body.loadPolygon('physicsData', 'cakeblock3');
    cakeblock3.body.setCollisionGroup(blockCollisionGroup);
    cakeblock3.body.collides([blockCollisionGroup]);   

    cake1.body.loadPolygon('physicsData', 'cake1');
    cake1.body.setCollisionGroup(blockCollisionGroup);
    cake1.body.collides([blockCollisionGroup]);   

    
    // create physics body for mouse which we will use for dragging clicked bodies
    mouseBody = new p2.Body();
    this.physics.p2.world.addBody(mouseBody);
        
    // attach pointer events
    this.input.onDown.add(this.click, this);
    this.input.onUp.add(this.release, this);
    this.input.addMoveCallback(this.move, this);
    
    },        

    
 click: function (pointer) {

    var bodies = this.physics.p2.hitTest(pointer.position, [ cakeblock1.body, cakeblock2.body, cakeblock3.body, cake1.body ]);
    
    // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
    var physicsPos = [this.physics.p2.pxmi(pointer.position.x), this.physics.p2.pxmi(pointer.position.y)];
    
    if (bodies.length)
    {
        var clickedBody = bodies[0];
        
        var localPointInBody = [0, 0];
        // this function takes physicsPos and coverts it to the body's local coordinate system
        clickedBody.toLocalFrame(localPointInBody, physicsPos);
        
        // use a revoluteContraint to attach mouseBody to the clicked body
        mouseConstraint = this.game.physics.p2.createRevoluteConstraint(mouseBody, [0, 0], clickedBody, [this.physics.p2.mpxi(localPointInBody[0]), this.physics.p2.mpxi(localPointInBody[1]) ]);
    }   

},

release: function () {

    // remove constraint from object's body
    this.physics.p2.removeConstraint(mouseConstraint);

},

 move: function (pointer) {
   
    // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
    mouseBody.position[0] = this.physics.p2.pxmi(pointer.position.x);
    mouseBody.position[1] = this.physics.p2.pxmi(pointer.position.y);

},

	update: function () {

		//if lifeTotal is less than 1 or seconds = 60 or gameOver variable = true then execute 'truegameOver' function
		if (seconds == 60 || gameOver===true) {
			this.gameOver();
		}
		//else execute 'createUfo','createLife','moveShip','collisionDetection' function
		else {
	
			this.collisionDetection();
            
		}
	},

	//function executed during playing the game to check for collisions
	collisionDetection: function () {

	},

	//Updates timer and outputs to the screen
	updateTimer: function () {
		seconds++;
		timerText.text = 'Time: ' + seconds;
	},

	//function is executed when the game ends. Stops Ship, Kills all objects, stops timer, Display Restart Button
	gameOver: function () {
		gameOverText.visible = true;
		restartButton.visible = true;
		timer.stop();
	},
    
    //Restart function, executed when restart button is pressed
	restartGame: function () {
		this.game.state.start('Game');
	},
    

};
