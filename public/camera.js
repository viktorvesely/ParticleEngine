class Camera {
  constructor(videoId, canvasId) {
    this.streaming = false;
    this.height = 0;
    this.width = 0;
    this.updateTime = 110;
    
    this.video = document.getElementById(videoId);
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    
    this.resize();
    
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
  
  resize() {
    this.height = this.video.offsetHeight;
    this.width = this.video.offsetWidth;
  }
  
  capture() {
    this.context.drawImage(this.video, 0, 0, this.width, this.height);
    let data = this.canvas.toDataURL('image/png');
    var frame = new Image(this.width, this.height)
    frame.src = data;
    return frame;
  }
}