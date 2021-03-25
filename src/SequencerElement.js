import $el from "./$el";
import mouse from "./mouse";
import globalSettings from "./globalSettings";
import Sampler from "./Sampler";
import Metronome from "./Metronome";

class SequencerButton extends $el{
    /** 
     * @param {number} n
     * @param {Sequencer} parent
     */
    constructor(n, parent) {
        let $main = document.createElement("div");
        super($main);
        this.addClass("seqbutton");
        parent.append($main);
        this.data = 0;
        //pendant: evaluate wether the let n is still useful. remove it at every end.
        this.n = n;
        let self = this;
        this.setData = function (to) {
            if (to != this.data) {
                if (to == 1) {
                    this.data = 1;
                    this.addClass("on");
                    parent.aliveChild++;
                }
                if (to == 0) {
                    this.data = 0;
                    this.removeClass("on");
                    parent.aliveChild--;
                }
            }
            // console.log(parent.aliveChild);
        }
        this.on("mousedown tap touchstart", function (event) {
            event.preventDefault();
            self.setData(Math.abs(self.data - 1));
            // self.data=;
            if (self.data == 1) {
                mouse.switching = true;
            } else {
                //   $(this).removeClass("on");
                //   parent.aliveChild--;
                mouse.switching = false;
            }
        });
        this.on("mouseenter touchenter", function () {
            if (mouse.pressed) {
                if (mouse.switching) {
                    if (self.data == 0) {
                        self.setData(1);
                    }
                } else {
                    if (self.data == 1) {
                        self.setData(0);
                    }
                }
            }
        });
        this.myTurn = function () {
            let jq = this;
            jq.addClass("turn");
            window.setTimeout(function () {
                jq.removeClass("turn");
            }, 200);
            return this.data;
        }
    }
}
const fixedPositions = true;
class Sequencer extends $el{
    /** 
     * @param {number} n
     * @param {$el} parent
     */
    constructor(parent,n,colorNumber) {
        
        let $main = document.createElement("div"); 
        super($main);
        
        this.id = n;

        $main.id='#seq_' + n;
        parent.append($main);
        
        //defines all the sequencer parameters by math,
        //maybe in a funture by styling table
        this.alive = false;
        this.pos = 0;
        this.data = [];
        this.len = 2 * Math.pow(2, (n % 4) + 1);
        this.evry = Math.pow(2, (n % 5) + 1);
        //must count an [every] amount of beats for each pos increment.
        this.subpos = 0;
        $main.setAttribute("style",`width: ${16 * Math.ceil(this.len / 4)}px`);
        this.addClass("color_" + colorNumber);
        this.addClass("miniseq");
        this.disp = 0;
        this.beatDisplace = 0;

        this.aliveChild = 0;
        for (let bn = 0; bn < this.len; bn++) {
            this.data[bn] = new SequencerButton(bn, this)
        }
        this.trigger = () => {}
        this.step = (metronome) => {
            this.alive = this.aliveChild > 0;
            if (this.alive) {
                
                if(fixedPositions){
                    this.subpos= metronome.stepsCount=0;
                }else{
                    this.subpos++;
                }

                if (this.subpos % this.evry == 0) {
                    if (this.data[this.pos].myTurn() == 1) {
                        this.trigger();
                    }
                    this.pos = (this.pos+1) % this.len;
                    this.subpos = 0;
                } else {
                }
            }
        }
        this.die = () => {
            for (let bn in this.data) {
                this.data[bn].setData(0);
            }
            this.alive = false;
            this.detach();
        }

        /** @param {Metronome} metronome */
        this.start = (metronome) => {
            metronome.appendEventScheduler((inTime)=>{
                setTimeout(()=>this.step(metronome),inTime);
            });
        }
        /** @param {Sampler} sampler */
        this.setSampler = (sampler) => {
            this.trigger = (inTime) => sampler.startIn(inTime);
        }
    }
}

export default Sequencer;