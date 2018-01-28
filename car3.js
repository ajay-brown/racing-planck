planck.testbed('Car', function(testbed) {

    testbed.speed = 1.3;
    testbed.hz = 1 / 50;
    
    testbed.height = 40;
    testbed.width = 100;
    
    var pl = planck, Vec2 = pl.Vec2;
    var world = new pl.World({
      gravity : Vec2(0, -10)
    });
    
    // wheel spring settings
    var HZ = 4.0;
    var ZETA = 0.7;
    var SPEED = 50.0;
    
    var ground = world.createBody();
    
    var groundFD = {
      density : 0.0,
      friction : 0.6
    };
    
    ground.createFixture(pl.Edge(Vec2(-20.0, 0.0), Vec2(20.0, 0.0)), groundFD);
    
    var hs = [ 0.25, 1.0, 4.0, 0.0, 0.0, -1.0, -2.0, -2.0, -1.25, 0.0 ];
    
    var x = 20.0, y1 = 0.0, dx = 5.0;
    
    for (var i = 0; i < 2; ++i) {
      var y2 = hs[i];
      ground.createFixture(pl.Edge(Vec2(x, y1), Vec2(x + dx, y2)), groundFD);
      y1 = y2;
      x += dx;
    }
    
    for (var i = 0; i < 10; ++i) {
      var y2 = hs[i];
      ground.createFixture(pl.Edge(Vec2(x, y1), Vec2(x + dx, y2)), groundFD);
      y1 = y2;
      x += dx;
    }
    
    ground.createFixture(pl.Edge(Vec2(x, 0.0), Vec2(x + 40.0, 0.0)), groundFD);
  
    // Teeter toter physics
    var teeter = world.createDynamicBody(Vec2(130.0, 1.0));
    teeter.createFixture(pl.Box(10.0, 0.25), 1.0);
    world.createJoint(pl.RevoluteJoint({
      lowerAngle : -8.0 * Math.PI / 180.0,
      upperAngle : 8.0 * Math.PI / 180.0,
      enableLimit : true
    }, ground, teeter, teeter.getPosition()));
    
    teeter.applyAngularImpulse(100.0, true);
    
//plank 2
    var teeter1 = world.createDynamicBody(Vec2(185.0, 1.0));
    teeter1.createFixture(pl.Box(35.0, 0.25), 1.0);
    world.createJoint(pl.RevoluteJoint({
        lowerAngle : -8.0 * Math.PI / 180.0,
      upperAngle : 8.0 * Math.PI / 180.0,
      
      enableLimit : true
    }, ground, teeter1, teeter1.getPosition()));
    teeter1.applyAngularImpulse(100.0, true);

//plank 3
var teeter2 = world.createDynamicBody(Vec2(255.0, 1.0));
teeter2.createFixture(pl.Box(20.0, 0.25), 1.0);
world.createJoint(pl.RevoluteJoint({
    lowerAngle : -10.0 * Math.PI / 180.0,
  upperAngle : 10.0 * Math.PI / 180.0,
  
  enableLimit : true
}, ground, teeter2, teeter2.getPosition()));
teeter2.applyAngularImpulse(100.0, true);
    

//plank 4
var teeter3 = world.createDynamicBody(Vec2(305.0, 1.0));
teeter3.createFixture(pl.Box(25.0, 0.25), 1.0);
world.createJoint(pl.RevoluteJoint({
    lowerAngle : -15.0 * Math.PI / 180.0,
  upperAngle : 15.0 * Math.PI / 180.0,
  
  enableLimit : true
}, ground, teeter3, teeter3.getPosition()));
teeter3.applyAngularImpulse(100.0, true);

    // Car
    var car = world.createDynamicBody(Vec2(0.0, 1.0));
    car.createFixture(pl.Polygon([
      Vec2(-1.5, -0.5),
      Vec2(1.5, -0.5),
      Vec2(1.5, 0.0),
      Vec2(0.0, 0.9),
      Vec2(-1.15, 0.9),
      Vec2(-1.5, 0.2)
    ]), 1.0);
    
    var wheelFD = {};
    wheelFD.density = 1.0;
    wheelFD.friction = 0.9;
    
    var wheelBack = world.createDynamicBody(Vec2(-1.0, 0.35));
    wheelBack.createFixture(pl.Circle(0.4), wheelFD);
    
    var wheelFront = world.createDynamicBody(Vec2(1.0, 0.4));
    wheelFront.createFixture(pl.Circle(0.4), wheelFD);
    
    var springBack = world.createJoint(pl.WheelJoint({
      motorSpeed : 0.0,
      maxMotorTorque : 20.0,
      enableMotor : true,
      frequencyHz : HZ,
      dampingRatio : ZETA
    }, car, wheelBack, wheelBack.getPosition(), Vec2(0.0, 1.0)));
    
    var springFront = world.createJoint(pl.WheelJoint({
      motorSpeed : 0.0,
      maxMotorTorque : 10.0,
      enableMotor : false,
      frequencyHz : HZ,
      dampingRatio : ZETA
    }, car, wheelFront, wheelFront.getPosition(), Vec2(0.0, 1.0)));
    
    testbed.keydown = function() {
      if (testbed.activeKeys.down) {
        HZ = Math.max(0.0, HZ - 1.0);
        springBack.setSpringFrequencyHz(HZ);
        springFront.setSpringFrequencyHz(HZ);
    
      } else if (testbed.activeKeys.up) {
        HZ += 1.0;
        springBack.setSpringFrequencyHz(HZ);
        springFront.setSpringFrequencyHz(HZ);
      }
    };
    
    testbed.step = function() {
      // testbed.drawPolygon(points, 'red');
      if (testbed.activeKeys.right && testbed.activeKeys.left) {
        springBack.setMotorSpeed(0);
        springBack.enableMotor(true);
    
      } else if (testbed.activeKeys.right) {
        springBack.setMotorSpeed(-SPEED);
        springBack.enableMotor(true);
    
      } else if (testbed.activeKeys.left) {
        springBack.setMotorSpeed(+SPEED);
        springBack.enableMotor(true);
    
      } else {
        springBack.setMotorSpeed(0);
        springBack.enableMotor(false);
      }
    
      var cp = car.getPosition();
      if (cp.x > testbed.x + 10) {
        testbed.x = cp.x - 10;
    
      } else if (cp.x < testbed.x - 10) {
        testbed.x = cp.x + 10;
      }
    };

    //timer functions

    var h1 = document.getElementsByTagName('h1')[0],
    start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    clear = document.getElementById('clear'),
    seconds = 0, minutes = 0, hours = 0,
    t;

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
        }
    }
    
    h1.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
function timer() {
    t = setTimeout(add, 1000);
}
timer();


/* Start button */
start.onclick = timer;

/* Stop button */
stop.onclick = function() {
    clearTimeout(t);
}

/* Clear button */
clear.onclick = function() {
    h1.textContent = "00:00";
    seconds = 0; minutes = 0; hours = 0;
}

//reset game function
document.body.onkeyup = function(e){
  if(e.keyCode == 32){
    location.reload();
    }
  };


   
    testbed.info('←/→: Accelerate car, ↑/↓: Change spring frequency');

    return world;
    }
  ) 