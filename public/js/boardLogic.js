window.PhonePhong = window.PhonePhong || {};
window.PhonePhong.BoardLogic = function (audioComponents) {
    this.audioComponets = audioComponents;

    // defaults
    this.mainTimeOffset = 1000;
    this.secondaryOffset = 2;

    this.initBlinkCycle();
};

var $class = PhonePhong.BoardLogic.prototype;

var mainInterval;
$class.initBlinkCycle = function () {
    mainInterval = setInterval(_.bind(this.primaryLoop, this), this.mainTimeOffset);
};

var timeOutCnt = 0;
var loopRunning = false;
$class.primaryLoop = function () {
    //if (loopRunning) return;
    loopRunning = true;
    var len = this.mainTimeOffset > 100 ? 100 : Math.floor(this.mainTimeOffset/1.75);
    var pulses = [{ gain: this.audioComponets.oscVol1.gain, len: 100, currVol: this.osc1Vol }];
    if (timeOutCnt >= this.secondaryOffset) {
        pulses.push({ gain: this.audioComponets.oscVol2.gain, len: 100, currVol: this.osc2Vol });
        timeOutCnt = 0;
    } else {
        timeOutCnt++;
    }

    async.each(pulses, _pulse, function () {
       loopRunning = false;
    });

};

$class.setOsc1Vol = function (vol) {
    this.osc1Vol = vol;
    this.audioComponets.oscVol1.gain.value = vol;
};

$class.setOsc2Vol = function (vol) {
    this.osc2Vol = vol;
    this.audioComponets.oscVol2.gain.value = vol;
};

$class.setOsc1Freq = function (freq) {
    this.osc1Freq = freq;
    this.audioComponets.osc1.frequency.value = freq;
};

$class.setOsc2Freq = function (freq) {
    this.osc2Freq = freq;
    this.audioComponets.osc2.frequency.value = freq;
};

$class.setPrimaryOffset = function (value) {
    this.mainTimeOffset = value;
    clearInterval(mainInterval);
    mainInterval = setInterval(_.bind(this.primaryLoop, this), this.mainTimeOffset);
};

// --- private functions ---
function _pulse (opts, complete) {
    opts.gain.value = 0;
    setTimeout(function () {
        opts.gain.value = opts.currVol;
        complete();
    } , opts.len);
}