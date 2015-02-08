(function () {
    var OscillatorType = {
        'sine': 0,
        'square': 1,
        'sawtooth': 2,
        'triangle': 3,
        'custom': 4
    };

    // instantiate audio sources
    var audCtx = new webkitAudioContext();
    var mainVol = audCtx.createGain();
    var osc1 = audCtx.createOscillator();
    var oscVol1 = audCtx.createGain();
    var osc2 = audCtx.createOscillator();
    var oscVol2 = audCtx.createGain();

    // initialize default settings
    mainVol.gain.value = 0.5;
    oscVol1.gain.value = 0.5;
    oscVol2.gain.value = 0.5
    osc1.type = OscillatorType.sine;
    osc2.type = OscillatorType.sine;
    osc2.frequency.value = 3000;

    // create connections
    osc1.connect(oscVol1);
    oscVol1.connect(mainVol);
    osc2.connect(oscVol2);
    oscVol2.connect(mainVol);
    mainVol.connect(audCtx.destination);

    osc1.start(0);
    osc2.start(1);

    var audioComponents = {
        mainVol: mainVol,
        oscVol1: oscVol1,
        oscVol2: oscVol2,
        osc1: osc1,
        osc2: osc2,
        speakers: audCtx.destination
    };

    var logicBoard = new PhonePhong.BoardLogic(audioComponents);
    var ui = new PhonePhong.UI({ logicBoard: logicBoard,  audioComponents: audioComponents });

})();