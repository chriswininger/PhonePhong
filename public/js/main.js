(function () {
    var OscillatorType = {
        'sine': 0,
        'square': 1,
        'sawtooth': 2,
        'triangle': 3,
        'custom': 4
    };

    var defaults = {
        mainVol: 0.5,
        osc1Vol: 0.9949676394462585,
        osc2Vol: 0.9949676394462585,
        osc1Freq: 440,
        osc2Freq: 1000,
        primaryOffset: 0.5,
        osc1MaxFreq: 3000,
        osc2MaxFreq: 10,
        primaryOffsetMax: 10,
        secondaryOffsetMax: 8,
        secondaryOffset: 1.0
    };

    var logicBoard = new PhonePhong.BoardLogic(new webkitAudioContext(), defaults);
    var ui = new PhonePhong.UI(logicBoard);
})();

/*var max = 0, min = 0;
var _bufferSize = 4096;
function _VolumeCutOff (aux) {
    var node = aux.createScriptProcessor(_bufferSize, 1, 1);
    node.onaudioprocess = function(e) {
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < _bufferSize; i++) {
            if (input[i] < 0) output[i] = 0;
            else output[i] = input[i];

        }
    };
    return node;
}*/