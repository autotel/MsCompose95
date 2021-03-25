
class Metronome {
    constructor(audioContext,bpm) {

        function noteDurationToMs(bpm) {
            return 1/4 * 60000 / bpm
        }

        this.stepsCount = 0;
        /**
         * @callback webAudioStartCallback
         * @param {number} time starting timestamp
         **/

        const webAudioStartCallbacks = [];
        /** @param {webAudioStartCallback} webAudioTimedCallback*/
        this.appendEventScheduler = (webAudioTimedCallback) => {
            webAudioStartCallbacks.push(webAudioTimedCallback);
        }

        function runScheduler(time) {
            webAudioStartCallbacks.forEach((cb)=>{
                cb(time);
            });
        }

        let metroInterval, lastNote = 0;

        let step = noteDurationToMs(bpm) / 1000;
        const lookAhead = step / 2;

        let run = false;
        const setRun = (to) => {
            run = to;
            step = noteDurationToMs(bpm) / 1000;
            clearInterval(metroInterval);
            metroInterval = setInterval(timer, step);
        }


        const timer = () => {
            const diff = audioContext.currentTime - lastNote;
            this.stepsCount+=1;

            if (diff >= lookAhead) {
                const nextNote = lastNote + step;
                runScheduler(nextNote);
                lastNote = nextNote;
            }
        }

        this.start = () => {
            this.stepsCount=0;
            console.log("start metro");
            setRun(true);
        }

        this.stop = () => {
            clearInterval(metroInterval);
            setRun(false);
        }

        this.toggle = () => {
            run ? stop() : start();
        }
    }
}
export default Metronome;