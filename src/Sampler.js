class Sampler {
    /** 
     * @param {Object} globals
     * @param {AudioContext} globals.audioContext
     * @param {AudioBuffer|false} [globals.audioBuffer]
     */
    constructor({ audioContext, audioBuffer = false }) {
        if(!audioContext) throw new Error("Sampler: audioContext is "+audioContext);
        this.ready=false;
        /** @type {AudioBuffer} */
        let myAudioBuffer;
        /** @type {AudioBufferSourceNode} */
        let myAudioSource= audioContext.createBufferSource();
        /** @type {GainNode} */
        let myGainNode = audioContext.createGain();
        myGainNode.gain.value = 0.6;
        myGainNode.connect(audioContext.destination);

        /** @param {AudioBuffer} audioBuffer */
        this.setBuffer = (audioBuffer) => {
            myAudioBuffer=audioBuffer;
            myAudioSource.buffer=myAudioBuffer;
            this.ready=true;
        }

        this.startIn = (time) => {
            myAudioSource.disconnect();
            myAudioSource = audioContext.createBufferSource();
            myAudioSource.connect(myGainNode);
            myAudioSource.buffer = myAudioBuffer;
            myAudioSource.start(time);
        }

        if(audioBuffer){
            this.setBuffer(audioBuffer);
        }

        
    }
}
export default Sampler;