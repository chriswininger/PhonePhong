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

$class.createComponents = function () {
    $('#phongUIGrid').height(window.innerHeight);
};

$class.listen = function () {
    var self = this;
    var oscTouch1 = document.getElementById('oscTouch1'),
        oscTouch2 = document.getElementById('oscTouch2');

    oscTouch1.addEventListener('touchmove', _handleOSCTouchMove, false);
    oscTouch2.addEventListener('touchmove', _handleOSCTouchMove, false);

    var osc1PulseOn = true;
    $(oscTouch1).on("tap",function(){
        if (osc1PulseOn) self.board.stopOsc1Pulse();
        else self.board.startOsc1Pulse();
        osc1PulseOn = !osc1PulseOn;
    });

    var osc2PulseOn = true;
    $(oscTouch2).on("tap",function(){
        if (osc2PulseOn) self.board.stopOsc2Pulse();
        else self.board.startOsc2Pulse();
        osc2PulseOn = !osc2PulseOn;
    });

    function _handleOSCTouchMove  (event) {
        // If there's exactly one finger inside this element
        if (event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];
            // Place element where the finger is
            event.target.setAttribute('cx', touch.pageX);
            event.target.setAttribute('cy', touch.pageY);

            var r = parseInt(event.target.getAttribute('r'));

            if (event.target.id === oscTouch1.id) {
                // update logic board
                var freq = map(touch.pageY, (r/2), window.innerHeight - r, 0, self.board.osc1MaxFreq);
                var primaryOffset= map(touch.pageX, (r/2), window.innerWidth - r, 0, self.board.primaryOffsetMax);

                if (freq<0)freq=0;
                if (primaryOffset<0) primaryOffset=0;

                self.board.setOsc1Freq(freq);
                self.board.setPrimaryOffset(primaryOffset);
            } else if (event.target.id === oscTouch2.id) {
                self.board.setOsc2Freq(map(touch.pageY, (r/2), window.innerHeight - event.target.getAttribute('height'), 0, self.board.osc1MaxFreq));
                self.board.setSecondaryOffset(map(touch.pageX, (r/2), window.innerWidth - r, 0, self.board.secondaryOffsetMax));

            }

            event.preventDefault();
        }
    }
};

// --- private helper functions ---
function map(val, x1, x2, y1, y2) {
    return (val -x1)/(Math.abs(x2-x1)) * Math.abs(y2 -y1) + y1;
}