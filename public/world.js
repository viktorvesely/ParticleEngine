class World {

  constructor(id, nParticles) {
    this.canvas = document.getElementById(id);
    this.particles = [];
  
    this.board = new Board(
      this.boardwidth,
      this.boardheight
    );
    
    this.resize();

    new Pressure(id, (x, y, value) => {
        if (value) {
          this.board.setGrid(x, y, value);
          this.simulation.postMessage(Msg(
            I_UPDATE_GRID,
            this.board.grid
          ));
        }
    });
    
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.shouldDraw = true;
    this.pause = false;
    this.lastDraw = performance.now();
    
    this.simulation = new Worker("simulation.js");

    this.simulation.onmessage = e => {
      let intent = e.data.intent;
      let data = e.data.data;

      switch (intent) {
        case I_UPDATE:
          this.particles = data.particles;
          this.board.grid = data.food;
          break;
      }
    };

    this.simulation.postMessage(
      Msg(
        I_SIMULATION_START,
        {
          nParticles: nParticles,
          width: this.canvas.width,
          height: this.canvas.height,
          boardSize: [this.boardwidth, this.boardheight] 
        }
      )
    );

    this.draw();
  }
  
  
  destroy() {
    this.simulation.terminate();
    this.shouldDraw = false;
  }

  resize() {
    let realSize = this.canvas.getBoundingClientRect();
    let width = realSize.width
    let height = realSize.height

    this.canvas.width = width;
    this.canvas.height = height;

    this.board.resize(width, height);

    if (this.simulation){
      this.simulation.postMessage(
        Msg(
          I_RESIZE,
          {
            width: width,
            height: height
          }
        )
      )
    } 
  }
  
  wrap() {
    window.wrapWorld = !window.wrapWorld;
    // TODO pass it to the simulation
  }

  showFPS (fps){
    this.ctx.fillStyle = "White";
    this.ctx.font = "normal 16pt Arial";

    this.ctx.fillText(Math.round(fps) + " fps", 10, 26);
  }
  

  draw() {
    if (!this.shouldDraw) { return; }
    requestAnimationFrame(() => {
      let ctx = this.ctx;
      // Refresh frame
      //this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

      // Draw background
      ctx.beginPath();
      ctx.fillStyle = "#060719";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw board 
      this.board.draw(ctx);
      //this.ctx.beginPath();
      this.particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.pos.x, particle.pos.y, particle.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
    
      let delta = (performance.now() - this.lastDraw)/1000;
      this.lastDraw = performance.now();
      let fps = 1/delta;
      this.showFPS(fps);
      this.draw();
    })
  }
}


window.debugTime = 0;
window.nPopulation = 230;

World.prototype.boardwidth = 10;
World.prototype.boardheight = 7;

let world = new World("world", window.nPopulation);


window.addEventListener("resize", () => {
  world.resize();
})

window.onkeyup = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  
   if (key == 87) { // W
    world.wrap();
  } else if (key == 38) { // KEY_UP
    world.destroy();
    window.nPopulation += 20;
    console.log(nPopulation);
    world = new World("world", window.nPopulation , window.tickBase);
  } else if (key == 40) { // KEY_DOWN
    world.destroy();
    window.nPopulation -= 20;
    world = new World("world", window.nPopulation, "BEHAVIOUR" , window.tickBase);
  } else if (key == 80) { // P
    world.pause = !world.pause;
  }
}
