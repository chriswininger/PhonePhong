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
      osc2MaxFreq: 5000
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
var osc1FreqSlider,
    osc2FreqSlider,
    primaryTimingSlider,
    secondaryTimingSlider;

$class.createComponents = function () {
    osc1FreqSlider = $("#osc1FreqSlider").slider({
        min: 0,
        max: this.defaults.osc1MaxFreq,
        value: this.defaults.osc1Freq
    });
    osc2FreqSlider = $("#osc2FreqSlider").slider({
        min: 0,
        max: this.defaults.osc2MaxFreq,
        value: this.defaults.osc2Freq
    });
    primaryTimingSlider = $('#primaryTimingSlider').slider({
        min: 0,
        max: 5000,
        value: 500
    });
    secondaryTimingSlider = $('#secondaryTimingSlider').slider({
        min: 0,
        max: 30,
        value: 2
    });
};

$class.listen = function () {
    var self = this;
    $(osc1FreqSlider).on('slidechange', function (event, ui) {
       self.board.audioComponents.osc1.frequency.value = ui.value;
    });
    $(osc2FreqSlider).on('slidechange', function (event, ui) {
        self.board.audioComponents.osc2.frequency.value = ui.value;
    });

    $(primaryTimingSlider).on('slidechange', function (event, ui) {
        self.board.logicBoard.setPrimaryOffset(ui.value);
    });
    $(secondaryTimingSlider).on('slidechange', function (event, ui) {
       self.board.logicBoard.secondaryOffset = ui.value;
    });
    $('#power').on('change', function (event, ui) {
        var checked = $(event.target).is(':checked');
        if (checked) {
            self.board.audioComponents.mainVol.connect(self.board.audioComponents.speakers);
        } else {
            self.board.audioComponents.mainVol.disconnect(self.board.audioComponents.speakers);
        }
    });
};

$class.updateBoard = function (values) {
    this.board.logicBoard.setOsc1Vol(values.osc1Vol);
    this.board.logicBoard.setOsc2Vol(values.osc2Vol);
    this.board.logicBoard.setOsc1Freq(values.osc1Freq);
    this.board.logicBoard.setOsc2Freq(values.osc2Freq);
};