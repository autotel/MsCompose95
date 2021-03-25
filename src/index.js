import $el from "./$el";
import Sequencer from "./SequencerElement";
import AudioContextGetter from "./AudioContext";
import Metronome from "./Metronome";
import Sampler from "./Sampler";
import b64sounds from "../res/sounds";
import base64decoder from "./base64decoder";

window.addEventListener("load",()=>{
    const b64Keys=Object.keys(b64sounds);

    const $root = document.getElementById("mscomp");
    const amountOfSequencers = $root.getAttribute("data-sequencers") || b64Keys.length
    const root = new $el($root);

    root.append(document.createElement("div"));
    let n = 0;

    const sequencers = [];
    for(let n = 0; n<amountOfSequencers; n++){
        sequencers.push(new Sequencer(root,n,n%b64Keys.length));
    }
    const acg = new AudioContextGetter();
    acg.get().then((audioContext)=>{
        const buffers = [];
        const samplers = [];
        const sampleLoadPromiseList=[];
        b64Keys.forEach(function(key,num){
            let b64 = b64sounds[key];
            // console.log("decoding",b64);
            sampleLoadPromiseList.push(base64decoder(b64,audioContext).then((audioBuffer)=>{
                buffers[num] = audioBuffer;
                samplers[num] = new Sampler({audioContext});
                samplers[num].setBuffer(audioBuffer);

            }).catch(console.log));
        });
        (Promise.all(sampleLoadPromiseList)).then(()=>{
            sequencers.forEach((sequencer,num)=>{

                sequencer.setSampler(samplers[num%b64Keys.length]);
            });
        });

        window.buffers=buffers;
        window.samplers=samplers;
        
        const metronome = new Metronome(audioContext,90);
        sequencers.forEach((sequencer,n)=>{
            sequencer.start(metronome)
        });
        metronome.start();
    });


});