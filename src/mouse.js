class Mouse {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.pressed=false;
        /** whether its setting seq. buttons on or off */
        this.switching = true;

        document.addEventListener("mousedown",(event)=>{
            this.pressed=true;
        });
        document.addEventListener("mouseup",(event)=>{
            this.pressed=false;
        });
        document.addEventListener("mousemove",(event)=>{
            this.x = event.clientX;
            this.y = event.clientY;
        });
    }
}

if(!window.mouse) window.mouse =  new Mouse();

/** @type {Mouse} */
const mouse = window.mouse;

export default mouse;