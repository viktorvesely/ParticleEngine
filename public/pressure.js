class Pressure {
    constructor(id, drawCallback) {
        this.el = document.getElementById(id);
        
        this.el.addEventListener("pointerdown", e => {
            console.log("down");
            drawCallback(e.x, e.y, e.pressure);
        });
        
        this.el.addEventListener("pointermove", e => {
            console.log("update");
            drawCallback(e.x, e.y, e.pressure);
        });

        this.el.addEventListener("pointerup", e => {
            console.log("up");
            drawCallback(e.x, e.y, null);
        });
    }
}