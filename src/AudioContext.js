

class AudioContextGetter {
    constructor(){
        /** @type {AudioContext|false} */
        let audioContext=false;
        /** @returns {Promise<AudioContext>} */
        this.get = () => {
            return new Promise((resolve)=>{
                if(audioContext){
                    resolve(audioContext);
                }else{
                    document.addEventListener("mousedown",()=>{
                        
                        if(!audioContext){
                            console.log("creating audio context (user gesture)");
                            audioContext = new(window.AudioContext || window.webkitAudioContext)();
                        }

                        if(audioContext) resolve(audioContext);
                    });
                }
            });
        }
    }
}

export default AudioContextGetter;