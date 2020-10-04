class World {

  constructor(id, nParticles, mode=null) {
    this.canvas = document.getElementById(id);
    this.nParticles = nParticles;
    this.particles = null;
  
    this.board = new Board(
      this.boardwidth,
      this.boardheight
    ).loadFromImage(IMAGE);

    
    this.fadeWorld = false;

    this.resize();

    
    this.ctx = this.canvas.getContext("2d", { alpha: false });
    this.shouldDraw = true;
    this.pause = false;
    this.lastDraw = performance.now();

    this.simulation = null;
    this.drawMode = false;
    
    if (!mode) {
      this.initializeWorker();
    } else if (mode === "DRAW") {
      new Pressure(id, (x, y, value) => {
          if (value) {
            this.board.setGrid(x, y, value);
          }
      });
      this.drawMode = true;
    }

    this.draw();
  }


  initializeWorker() {
    this.simulation = new Worker("simulation.js");

    this.simulation.onmessage = e => {
      this.particles = new Float32Array(e.data);
    };

    this.simulation.postMessage(
      Msg(
        I_SIMULATION_START,
        {
          nParticles: this.nParticles,
          width: this.canvas.width,
          height: this.canvas.height,
          boardSize: [this.boardwidth, this.boardheight] 
        }
      )
    );

    
    this.simulation.postMessage(
      Msg(
        I_UPDATE_GRID,
        this.board.grid
      )
    );
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
    this.ctx.font = "normal 12pt Arial";

    this.ctx.fillText(Math.round(fps), 10, 26);
  }
  

  draw() {
    if (!this.shouldDraw) { return; }
    requestAnimationFrame(() => {
      let ctx = this.ctx;
      // Refresh frame
      // this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

      // Draw background
      if (!this.fadeWorld) {
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }

      // Draw board 
      if (this.drawMode) {
        this.board.draw(ctx);
      }

      
      if (this.particles) {
        let particleData = new ParticleData(this.particles);
        let length = particleData.length();
        for (var i = 0; i < length - 1; i++) {
          let x = particleData.readFloat();
          let y = particleData.readFloat();
          let color = particleData.readColor();
          let radius = particleData.readFloat();
        
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2, false);
          ctx.fillStyle = color;
          ctx.fill();
        
        }
        
        //this.ctx.fillText(length, 500, 26);
      }
    
      let delta = (performance.now() - this.lastDraw)/1000;
      this.lastDraw = performance.now();
      let fps = 1/delta;
      //this.showFPS(fps);
      this.draw();
    })
  }
}


window.debugTime = 0;
window.nPopulation = 30;

World.prototype.boardwidth = IMAGE[0].length;
World.prototype.boardheight = IMAGE.length;

let world = new World("world", window.nPopulation);


window.addEventListener("resize", () => {
  world.resize();
})

window.onkeyup = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  
   if (key == 87) { // W
    world.wrap();
  } else if (key == 80) { // P
    world.fadeWorld = !world.fadeWorld;
  } else if (key == 68) { // D
    world.destroy();
    world = new World("world", window.nPopulation, "DRAW")
  }
}
