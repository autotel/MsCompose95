var channels=[{
  "type": "sampler",
  "name": "Sampler0",
  "source": "audio/PVC (3).mp3",
  "startOffset": 0.146,
  "endTime": 0.191
}, {
  "type": "sampler",
  "name": "Sampler1",
  "source": "audio/PVC (2).mp3",
  "startOffset": 0.179,
  "endTime": 0.292
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (1).mp3",
  "startOffset": 0.645,
  "endTime": 1.486
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (4).mp3",
  "startOffset": 0.367,
  "endTime": 0.992
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (5).mp3",
  "startOffset": 0.12,
  "endTime": 0.153
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (6).mp3",
  "startOffset": 1.83,
  "endTime": 2.783
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (7).mp3",
  "startOffset": 1.431,
  "endTime": 2.127
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (8).mp3",
  "startOffset": 1.453,
  "endTime": 2.313
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (9).mp3",
  "startOffset": 0.444,
  "endTime": 1.021
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (10).mp3",
  "startOffset": 0.106,
  "endTime": 0.974
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (11).mp3",
  "startOffset": 1.208,
  "endTime": 2.289
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (12).mp3",
  "startOffset": 0.267,
  "endTime": 0.616
}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/PVC (13).mp3",
  "startOffset": 0.072,
  "endTime": 0.281
}]
for(c in channels){
  channels[c].id=c;
}


function chanexp(){
  return JSON.stringify(channels);
}