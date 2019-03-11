class World {

  constructor(id, nParticles, mode="BEHAVIOUR", tickBase=60) {
    this.canvas = document.getElementById(id);
    this.resize();
    this.ctx = this.canvas.getContext("2d");
    this.maxLines = Math.floor(this.canvas.height / this.lineSize);
    this.particlesOffset = this.canvas.width / this.nParticlesPerLine;
    this.shouldDraw = true;
    
    this.behaviour = new Behaviour();
    this.tickBase = tickBase;
    this.particles = [];
        
    this.switchMode(mode);
    
    window.wrapWorld = true;
    this.initPopulation(nParticles);

    this.collision = new CollisionManager(this.particles, this.canvas);
    
    this.interval = setInterval(function(context) {
      context.tick.call(context);
    }, 1000 / this.tickBase, this);
    this.draw();
  }
  
  switchMode (mode) {
    let nMode = this.MODE[mode] || this.MODE.BEHAVIOUR;
    let nextFriction = this.FRICTION[nMode] || this.FRICTION[this.DEFAULT_FRICTION];
    this.frictionCoefficient = nextFriction;
    this.mode = nMode;
  }
  
  shuffleBehaviour () {
    this.behaviour.shuffleBehaviour();
  }
  
  destroy() {
    clearInterval(this.interval);
    this.shouldDraw = false;
  }

  resize() {
    let realSize = this.canvas.getBoundingClientRect();
    this.canvas.width = realSize.width;
    this.canvas.height = realSize.height;
  }
  
  wrap() {
    window.wrapWorld = !window.wrapWorld;
  }

  initPopulation(nParticles) {
    let finalPopulationSize = nParticles
    let lines = Math.ceil(nParticles / this.nParticlesPerLine);
    if (lines > this.maxLines) {
      finalPopulationSize = this.maxLines * this.nParticlesPerLine;
    }
    for (let i = 0; i < finalPopulationSize; ++i) {
      let currentLine = Math.floor(i / this.nParticlesPerLine) + 1;
      let currentIndex = i % this.nParticlesPerLine;
      let currentXPos = (currentIndex * this.particlesOffset) + (this.particlesOffset / 2);
      this.particles.push(new Particle(new Vector(currentXPos , currentLine * this.lineSize), this.particles.length, this.behaviour));
    }
  }

  tick() {
    this.collision.collide();
    this.particles.forEach(particle => {
      let friction = new Vector(particle.speed)
        .negative()
        .multiply(this.frictionCoefficient)
        .multiply(particle.type.frictionModificator);
      particle.speed.add(friction);
      particle.behave(this.particles, this.mode, this.MODE);
      particle.pos.add(particle.speed);
    });
  }

  draw() {
    if (!this.shouldDraw) { return; }
    requestAnimationFrame(() => {
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.ctx.beginPath();
      this.ctx.fillStyle = "#060719";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(particle => {
        particle.draw(this.ctx);
      });
      this.draw();
    })
  }
}

World.prototype.nParticlesPerLine = 20;
World.prototype.lineSize = 40;
World.prototype.frictionCoefficient = 0.1;
World.prototype.MODE = {};
World.prototype.FRICTION = [];
World.prototype.MODE.BEHAVIOUR = 0;
World.prototype.MODE.HOLLOW = 1;
World.prototype.MODE.FOLLOW = 2;
World.prototype.DEFAULT_FRICTION = -1;
World.prototype.FRICTION[World.prototype.DEFAULT_FRICTION] = 0.1;
World.prototype.FRICTION[World.prototype.MODE.HOLLOW] = 0.04;


window.debugTime = 0;
window.nPopulation = 230;

let world = new World("world", window.nPopulation, "BEHAVIOUR" , 50);
window.addEventListener("resize", () => {
  world.resize();
})

window.onkeyup = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  
  if (key == 83) { // S
    world.shuffleBehaviour();
  } else if (key == 87) { // W
    world.wrap();
  } else if (key == 38) { // KEY_UP
    world.destroy();
    window.nPopulation += 20;
    world = new World("world", window.nPopulation, "BEHAVIOUR" , 50);
  } else if (key == 40) { // KEY_DOWN
    world.destroy();
    window.nPopulation -= 20;
    world = new World("world", window.nPopulation, "BEHAVIOUR" , 50);
  } else if (key == 49) { // 1
    world.switchMode("BEHAVIOUR");
  }
  else if (key == 50) { // 2
    world.switchMode("HOLLOW");
  }
  else if (key == 51) { // 3
    world.switchMode("FOLLOW");
  }
}
