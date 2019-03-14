class Camera {
  constructor(videoId, canvasId) {
    this.streaming = false;
    this.photo = null;
    this.height = 0;
    this.width = 0;
    
    this.video = document.getElementById(videoId);
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
  }
  
  resize() {
    this.height = this.video.offsetHeight;
    this.width = this.;
  }
  
  capture(listener) {
    
    this.video.addEventListener('canplay', ev => {
      if (!this.streaming) {
        this.streaming = true;
      }
    }, false);
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then(stream => {
            this.video.srcObject = stream;
            this.video.play();
        })
        .catch(err => {
            console.error(err);
        });
    
  }
}