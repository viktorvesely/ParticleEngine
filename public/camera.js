class Camera {
  constructor(videoId, canvasId) {
    this.streaming = false;
    this.photo = null;
    
    this.video = document.getElementById(videoId);
    this.canvas = document.getElementById(canvasId);
  }
  
  capture(listener) {
    
    this.video.addEventListener('canplay', ev => {
      if (!this.streaming) {
        height = video.videoHeight / (video.videoWidth/width);

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
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