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

    this.defaults = {
        mainVol: 0.5,
        osc1Vol: 0.5,
        osc2Vol: 0.5,
        osc1Freq: 100,
        osc2Freq: 200,
        osc1MaxFreq: 5000,
        osc2MaxFreq: 5000,
        primaryOffsetMax: 5000,
        secondaryOffsetMax: 10
    };

    // seed board with default values
    this.updateBoard(this.defaults);
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

    function _handleOSCTouchMove  (event) {
        // If there's exactly one finger inside this element
        if (event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];
            // Place element where the finger is
            event.target.setAttribute('cx', touch.pageX);
            event.target.setAttribute('cy', touch.pageY);

            if (event.target.id === oscTouch1.id) {
                // update logic board
                self.board.logicBoard.setOsc1Freq(map(touch.pageY, event.target.getAttribute('r'), window.innerHeight - event.target.getAttribute('r'), 0, self.defaults.osc1MaxFreq));
                self.board.logicBoard.setPrimaryOffset(map(touch.pageX, event.target.getAttribute('r'), window.innerWidth - event.target.getAttribute('r'), 0, self.defaults.primaryOffsetMax));
            } else if (event.target.id === oscTouch2.id) {
                self.board.logicBoard.setOsc2Freq(map(touch.pageY, event.target.getAttribute('r'), window.innerHeight - event.target.getAttribute('height'), 0, self.defaults.osc1MaxFreq));
                self.board.logicBoard.setSecondaryOffset(map(touch.pageX, event.target.getAttribute('r'), window.innerWidth - event.target.getAttribute('r'), 0, self.defaults.secondaryOffsetMax));

            }

            event.preventDefault();
        }
    }
};

$class.updateBoard = function (values) {
    this.board.logicBoard.setOsc1Vol(values.osc1Vol);
    this.board.logicBoard.setOsc2Vol(values.osc2Vol);
    this.board.logicBoard.setOsc1Freq(values.osc1Freq);
    this.board.logicBoard.setOsc2Freq(values.osc2Freq);
};

// --- private helper functions ---
function map(val, x1, x2, y1, y2) {
    return (val -x1)/(Math.abs(x2-x1)) * Math.abs(y2 -y1) + y1;
}