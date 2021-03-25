
/**
 * @param {string} base64
 * @param {AudioContext} audioContext 
 * @returns {Promise<AudioBuffer>} 
 * */
export default function (base64,audioContext) {
    var binary = window.atob(base64);
    var buffer = new ArrayBuffer(binary.length);
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < buffer.byteLength; i++) {
        bytes[i] = binary.charCodeAt(i) & 0xFF;
    }
    return new Promise((resolve,reject)=>{
        audioContext.decodeAudioData(
            buffer,
            (audioBuffer)=>{
                resolve(audioBuffer);
            },
            reject
        );
    });
}