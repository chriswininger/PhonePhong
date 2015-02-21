/**
 * Latest thoughts on controls:
 *  Distance from center of each dot will control the offset, but sliders on the edge of the screen will
 *  let you move both dots up and down, or left and right as a group with fixed relative positions
 *    (Doesn't really work though, moving one pitch up would pitch shift the other one)
 *
 * Pinching/zoom will let you make dots bigger/smaller to control the volume
 *   double tab dot will turn it off/on
 * @type {{}|*|Window.PhonePhong}
 */


window.PhonePhong = window.PhonePhong || {};
window.PhonePhong.UI = function (board) {
    var self = this;
    this.board = board;

    // wait for dom to load
    $(function () {
        // make changes to dom to create ui
        self.createComponents();
        // set up dom events
        self.listen();
    });
};

var $class = PhonePhong.UI.prototype;

var oscTouchOnOff1, oscTouchOnOff2, oscTouchFade1, oscTouchFade2;
var oscTouchFade1Val = 0, oscTouchFade2Val = 0;
$class.createComponents = function () {
    $('#phongUIGrid').height(window.innerHeight);
    oscTouchOnOff1 = document.getElementById('oscTouchOnOff1');
    oscTouchOnOff2 = document.getElementById('oscTouchOnOff2');
    oscTouchFade1 = document.getElementById('oscTouchFade1');
    oscTouchFade2 = document.getElementById('oscTouchFade2');

    oscTouchOnOff1.setAttribute('y', window.innerHeight - oscTouchOnOff1.getAttribute('height'));
    oscTouchOnOff2.setAttribute('y', window.innerHeight - oscTouchOnOff2.getAttribute('height'));
};

$class.listen = function () {
    var self = this;
    var oscTouch1 = document.getElementById('oscTouch1'),
        oscTouch2 = document.getElementById('oscTouch2');

    oscTouch1.addEventListener('touchmove', _handleOSCTouchMove, false);
    oscTouch2.addEventListener('touchmove', _handleOSCTouchMove, false);

    oscTouchFade1.addEventListener('touchmove', _handleFadeMove, false);
    oscTouchFade2.addEventListener('touchmove', _handleFadeMove, false);

    oscTouchOnOff1.addEventListener('touchstart', _handleOff);
    oscTouchOnOff1.addEventListener('touchend', _handleOn);
    oscTouchOnOff2.addEventListener('touchstart', _handleOff);
    oscTouchOnOff2.addEventListener('touchend', _handleOn);

    var osc1PulseOn = true;
    $(oscTouch1).on('tap',function(){
        if (osc1PulseOn) self.board.stopOsc1Pulse();
        else self.board.startOsc1Pulse();
        osc1PulseOn = !osc1PulseOn;
    });

    var osc2PulseOn = true;
    $(oscTouch2).on('tap',function(){
        if (osc2PulseOn) self.board.stopOsc2Pulse();
        else self.board.startOsc2Pulse();
        osc2PulseOn = !osc2PulseOn;
    });


    $(oscTouch1).on('taphold', _handleLongTouch);
    $(oscTouch2).on('taphold', _handleLongTouch);

    function _handleOff (event) {
        if (event.target === oscTouchOnOff1) {
            self.board.osc1Off();
        } else if (event.target === oscTouchOnOff2) {
            self.board.osc2Off();
        }
        event.preventDefault();
    }
    function _handleOn (event) {
        if (event.target === oscTouchOnOff1) {
            self.board.osc1On();
        } else if (event.target === oscTouchOnOff2) {
            self.board.osc2On();
        }
        event.preventDefault();
    }
    var waves = ['sine', 'square', 'triangle', 'sawtooth'];
    var waveIntOsc1 = 0, waveIntOsc2 = 0;
    function _handleLongTouch (event) {
        if (event.target === oscTouch1) {
            waveIntOsc1++;
            if (waveIntOsc1 >= waves.length) waveIntOsc1 = 0;
            self.board.setOsc1Type(waves[waveIntOsc1]);
        } else if (event.target === oscTouch2) {
            waveIntOsc2++;
            if (waveIntOsc2 >= waves.length) waveIntOsc2 = 0;
            self.board.setOsc2Type(waves[waveIntOsc2]);
        }

        event.preventDefault();
    }

    function _handleOSCTouchMove  (event) {
        // If there's exactly one finger inside this element
        if (event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];
            var r = parseInt(event.target.getAttribute('r'));

            var fadeUIElement;
            var fadeUIOffset;
            if (event.target.id === oscTouch1.id) {
                // update logic board
                var freq = map(touch.pageY, (r/2), window.innerHeight - r, 0, self.board.osc1MaxFreq);
                var primaryOffset= map(touch.pageX, (r/2), window.innerWidth - r, 0, self.board.primaryOffsetMax);

                if (freq<0)freq=0;
                if (primaryOffset<0) primaryOffset=0;

                self.board.setOsc1Freq(freq);
                self.board.setPrimaryOffset(primaryOffset);
                fadeUIOffset = oscTouchFade1Val;
                // set other elements to move
                fadeUIElement = oscTouchFade1;
            } else if (event.target.id === oscTouch2.id) {
                self.board.setOsc2Freq(map(touch.pageY, (r/2), window.innerHeight - event.target.getAttribute('height'), 0, self.board.osc1MaxFreq));
                self.board.setSecondaryOffset(map(touch.pageX, (r/2), window.innerWidth - r, 0, self.board.secondaryOffsetMax));

                fadeUIOffset = oscTouchFade2Val;
                // set other elements to move
                fadeUIElement = oscTouchFade2;
            }

            // Place element where the finger is
            event.target.setAttribute('cx', touch.pageX);
            event.target.setAttribute('cy', touch.pageY);
            fadeUIElement.setAttribute('cx', touch.pageX - fadeUIOffset);
            fadeUIElement.setAttribute('cy', touch.pageY);

            event.preventDefault();
        }
    }

    function _handleFadeMove (event) {
        if (event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];
            event.target.setAttribute('cx', touch.pageX);

            if (event.target.id === oscTouchFade1.id) {
                oscTouchFade1Val = oscTouch1.getAttribute('cx') - touch.pageX;
                self.board.setPrimaryFade(map(-1*oscTouchFade1Val, -35, 35, -2, 2));
            } else {
                oscTouchFade2Val = oscTouch2.getAttribute('cx') - touch.pageX;
                // TODO (CAW) -- range should reflect size of outer sphere
                self.board.setSecondaryFade(map(-1*oscTouchFade2Val, -35, 35, -2, 2));
            }
        }
    }
};

// --- private helper functions ---
function map(val, x1, x2, y1, y2) {
    return (val -x1)/(Math.abs(x2-x1)) * Math.abs(y2 -y1) + y1;
}