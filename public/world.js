class World {

  constructor(id, nParticles, tickBase=60) {
    this.canvas = document.getElementById(id);
    this.resize();
    this.ctx = this.canvas.getContext("2d");
    this.maxLines = Math.floor(this.canvas.height / this.lineSize);
    this.particlesOffset = this.canvas.width / this.nParticlesPerLine;
    this.shouldDraw = true;
    
    this.tickBase = tickBase;
    this.particles = [];
    
    window.wrapWorld = true;
    shuffleBehaviour();
    this.initPopulation(nParticles);

    this.collision = new CollisionManager(this.particles, this.canvas);
    
    this.interval = setInterval(function(context) {
      context.tick.call(context);
    }, 1000 / this.tickBase, this);
    this.draw();
  }
  
  shuffle() {
    shuffleBehaviour();
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
      this.particles.push(new Particle(new Vector(currentXPos , currentLine * this.lineSize), this.particles.length));
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
      particle.behave(this.particles);
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

window.debugTime = 0;
window.nPopulation = 260;

let world = new World("world", window.nPopulation, 35);
window.addEventListener("resize", () => {
  world.resize();
})

window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
  
   if (key == 83) {
    world.shuffle();
   } else if (key == 87) {
     world.wrap();
   } else if (key == 38) {
     world.destroy();
     window.nPopulation += 20;
     world = new World("world", window.nPopulation, 35);
   } else if (key == 40) {
     world.destroy();
     window.nPopulation -= 20;
     world = new World("world", window.nPopulation, 35);
   }
}