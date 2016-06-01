channels = [{
  "type": "sampler",
  "name": "Sampler0",
  "source": "audio/mscomposeKit-03.mp3",
  "startOffset": 0.016,
  "endTime": 0.008,
  "id": "0"

}, {
  "type": "sampler",
  "name": "Sampler1",
  "source": "audio/mscomposeKit-02.mp3",
  "startOffset": 0.021,
  "endTime": 0.019,
  "id": "1"
// }, {
//   "type": "melodic",
//   "name": "melodic0",
//   "carrierAttack":0.001,
//   "carrierDecay":0.04,
//   "filterfq":0.1,
//   "filterq":2,
//   "filtergain":0.1,
//   "harmonicity":0.758,
//   "modulationIndex":0.5,
//   "id": "0"

}, {
  "type": "sampler",
  "name": "Sampler2",
  "source": "audio/mscomposeKit-01.mp3",
  "startOffset": 0.014,
  "endTime": 0.168,
  "id": "2"

}, {
  "type": "sampler",
  "name": "Sampler3",
  "source": "audio/mscomposeKit-04.mp3",
  "startOffset": 0,
  "endTime": 0.457,
  "id": "3"

}, {
  "type": "sampler",
  "name": "Sampler4",
  "source": "audio/mscomposeKit-05.mp3",
  "startOffset": 0.046,
  "endTime": 0.011,
  "id": "4"

}, {
  "type": "sampler",
  "name": "Sampler5",
  "source": "audio/mscomposeKit-06.mp3",
  "startOffset": 0.233,
  "endTime": 0.078,
  "id": "5"

}, {
  "type": "sampler",
  "name": "Sampler6",
  "source": "audio/mscomposeKit-07.mp3",
  "startOffset": 0.005,
  "endTime": 0.243,
  "id": "6"

}, {
  "type": "sampler",
  "name": "Sampler7",
  "source": "audio/mscomposeKit-08.mp3",
  "startOffset": 0.095,
  "endTime": 1.444,
  "id": "7"
}, {
  "type": "sampler",
  "name": "Sampler8",
  "source": "audio/mscomposeKit-09.mp3",
  "startOffset": 0.248,
  "endTime": 0.75,
  "id": "8"
}, {
  "type": "sampler",
  "name": "Sampler9",
  "source": "audio/mscomposeKit-10.mp3",
  "startOffset": 0.01,
  "endTime": 0.048,
  "id": "9"

}, {
  "type": "sampler",
  "name": "Sampler10",
  "source": "audio/mscomposeKit-11.mp3",
  "startOffset": 0.056,
  "endTime": 0.33,
  "volume": 0.4,
  "id": "10"

}, {
  "type": "sampler",
  "name": "Sampler11",
  "source": "audio/mscomposeKit-12.mp3",
  "startOffset": 0.394,
  "endTime": 1.815,
  "id": "11"

}, {
  "type": "sampler",
  "name": "Sampler12",
  "source": "audio/mscomposeKit-13.mp3",
  "startOffset": 0,
  "endTime": 2.593,
  "id": "12"

}, {
  "type": "sampler",
  "name": "Sampler13",
  "source": "audio/mscomposeKit-14.mp3",
  "startOffset": 0.001,
  "endTime": 0.061,
  "id": "13"

}, {
  "type": "sampler",
  "name": "Sampler14",
  "source": "audio/mscomposeKit-15.mp3",
  "startOffset": 0,
  "endTime": 0.119,
  "id": "14"

}, {
  "type": "sampler",
  "name": "Sampler15",
  "source": "audio/mscomposeKit-16.mp3",
  "startOffset": 0,
  "endTime": 0.268,
  "id": "15"

}, {
  "type": "sampler",
  "name": "Sampler16",
  "source": "audio/mscomposeKit-17.mp3",
  "startOffset": 0,
  "endTime": 0.122,
  "id": "16"

}]

for (c in channels) {
  channels[c].id = c;
}


function chanexp() {
  return JSON.stringify(channels);
}